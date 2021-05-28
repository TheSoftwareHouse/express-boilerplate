const { levenshteinDistance } = require("./utils");

// Query for AST object-type elements from array from pattern like this:
// getSubscribedEvents() {
//   return [{...}, {...}];
// }
const querySubscriptionDefinitions = `MethodDefinition:has(Identifier[name="getSubscribedEvents"]) BlockStatement ReturnStatement ArrayExpression ObjectExpression`;

module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
  },

  create: function (context) {
    return {
      [querySubscriptionDefinitions]: (node) => {
        if (!node.properties || node.properties.length < 2) {
          context.report(node, "Invalid subscription definition");
          return;
        }

        // "{ name, method }" pair
        const eventNameProperty = node.properties.find(({ key }) => key.name === "name");
        const eventMethodProperty = node.properties.find(({ key }) => key.name === "method");

        if (eventNameProperty === undefined || eventMethodProperty === undefined) {
          context.report(node, "Invalid subscription definition");
          return;
        }

        const eventNameExpression = eventNameProperty.value;
        const eventMethodExpression = eventMethodProperty.value;

        // Validate "{ name: ExampleEvent.eventName ... }" pattern
        if (eventNameExpression.type !== "MemberExpression" || eventNameExpression.property.name !== "eventName") {
          context.report(eventNameExpression, "Event name should be expression like: ExampleEvent.eventName");
          return;
        }

        // Validate "{ ..., method: "methodLiteral"}" pattern
        if (eventMethodExpression.type !== "Literal") {
          context.report(eventMethodExpression, "Event method should be a literal string");
          return;
        }

        let parent = node.parent;

        // Find EventSubscriber class body
        while (parent.type !== "ClassDeclaration") {
          parent = parent.parent;
        }

        // Find methods of that class
        const definedMethods = parent.body.body.filter(({ type }) => type === "MethodDefinition");
        const definedMethodNames = definedMethods.map(({ key }) => key.name);

        // Validate if method name from subscription definition matches against any methods of the EventSubscriber class
        if (definedMethodNames.includes(eventMethodExpression.value)) {
          return;
        }

        // Detect mistypings
        const potentialMethodMatch = definedMethodNames.find(
          potentialMatch => levenshteinDistance(potentialMatch, eventMethodExpression.value) <= 3
        );

        if (potentialMethodMatch !== undefined) {
          context.report({
            node: eventMethodExpression,
            message: `Event handler method does not exist, but perhaps you mean "${potentialMethodMatch}" method?`,
            fix: fixer => fixer.replaceText(eventMethodExpression, JSON.stringify(potentialMethodMatch)),
          });
          return;
        }

        // Propose adding handler method template if no match exists
        const lastMethodInClass = definedMethods.slice().pop();
        const eventClassName = eventNameExpression.object.name;

        context.report({
          node: eventMethodExpression,
          message: "Event handler method does not exist",
          fix: fixer => fixer.insertTextAfter(lastMethodInClass, [
            "",
            "",
            `  public async ${eventMethodExpression.value}(event: ${eventClassName}) {`,
            "    const {} = this.dependencies;",
            "  }"
          ].join("\n"))
        });
      }
    };
  },
};