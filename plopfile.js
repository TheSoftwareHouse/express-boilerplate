const { lstatSync, readdirSync, mkdirSync } = require("fs");
const path = require("path");
const kebabCase = require("lodash.kebabcase");

const DIRECTORIES_BLACKLIST = ["services", "repositories", "read-models", "managers"];

const NAME_REGEX = /[^\/]+$/;

const isDirectory = (source) => lstatSync(source).isDirectory();
const getDirectories = (source) =>
  readdirSync(source)
    .map((name) => path.join(source, name))
    .filter(isDirectory);

const routesLocation = path.join(__dirname, "src/app");
const commandHandlersLocation = path.join(__dirname, "src/container/command-handlers.ts");
const queryHandlersLocation = path.join(__dirname, "src/container/query-handlers.ts");
const routingLocation = path.join(__dirname, "src/container/routing.ts");
const databaseLocation = path.join(__dirname, "src/container/database.ts");
const subscribersLocation = path.join(__dirname, "src/container/subscribers.ts");
const graphqlResolverLocation = path.join(__dirname, "src/graphql/resolvers/index.ts");

const directories = getDirectories(`${routesLocation}/features`).filter(
  (name) => !DIRECTORIES_BLACKLIST.includes(NAME_REGEX.exec(name)[0]),
);

const isNotEmptyFor = (name) => {
  return (value) => {
    if (!value.trim()) return name + " is required";
    return true;
  };
};

// ACTIONS

const createAction = {
  type: "add",
  path: "{{module}}/actions/{{kebabCase name}}.action.ts",
  templateFile: "plop-templates/action.ts",
};

const createGraphqlQuery = {
  type: "add",
  path: "{{module}}/graphql/queries/{{kebabCase name}}.query.ts",
  templateFile: "plop-templates/graphql/query.ts",
};

const createGraphqlMutation = {
  type: "add",
  path: "{{module}}/graphql/mutations/{{kebabCase name}}.mutation.ts",
  templateFile: "plop-templates/graphql/mutation.ts",
};

const createCommand = {
  type: "add",
  path: "{{module}}/commands/{{kebabCase name}}.command.ts",
  templateFile: "plop-templates/command.ts",
};

const createEvent = {
  type: "add",
  path: "{{module}}/events/{{kebabCase name}}.event.ts",
  templateFile: "plop-templates/events/event.ts",
};

const createQuery = [
  {
    type: "add",
    path: "{{module}}/queries/{{kebabCase name}}/{{kebabCase name}}.query.ts",
    templateFile: "plop-templates/query/query.ts",
  },
  {
    type: "add",
    path: "{{module}}/queries/{{kebabCase name}}/{{kebabCase name}}.query.result.ts",
    templateFile: "plop-templates/query/query-result.ts",
  },
  {
    type: "add",
    path: "{{module}}/queries/{{kebabCase name}}/index.ts",
    templateFile: "plop-templates/query/index.ts",
  },
];

const createCommandHandler = [
  {
    type: "add",
    path: "{{module}}/handlers/{{kebabCase name}}.handler.ts",
    templateFile: "plop-templates/command-handler.ts",
  },
  {
    type: "modify",
    path: commandHandlersLocation,
    pattern: /(\/\/ HANDLERS_IMPORTS)/,
    template:
      'import {{pascalCase name}}CommandHandler from "../app/features/{{ getModuleName module }}/handlers/{{kebabCase name}}.handler";\n$1',
  },
  {
    type: "modify",
    path: commandHandlersLocation,
    pattern: /(\/\/ COMMAND_HANDLERS_SETUP)/,
    template: "awilix.asClass({{pascalCase name}}CommandHandler),\n      $1",
  },
];

const createQueryHandler = [
  {
    type: "add",
    path: "{{module}}/query-handlers/{{kebabCase name}}.query.handler.ts",
    templateFile: "plop-templates/query/query-handler.ts",
  },
  {
    type: "modify",
    path: queryHandlersLocation,
    pattern: /(\/\/ HANDLERS_IMPORTS)/,
    template:
      'import {{pascalCase name}}QueryHandler from "../app/features/{{ getModuleName module }}/query-handlers/{{kebabCase name}}.query.handler";\n$1',
  },
  {
    type: "modify",
    path: queryHandlersLocation,
    pattern: /(\/\/ QUERY_HANDLERS_SETUP)/,
    template: "awilix.asClass({{pascalCase name}}QueryHandler),\n      $1",
  },
];

const createRouting = {
  type: "add",
  path: `${routesLocation}/features/{{kebabCase name}}/routing.ts`,
  templateFile: "plop-templates/routing.ts",
};

const createModel = {
  type: "add",
  path: `{{module}}/models/{{kebabCase name}}.model.ts`,
  templateFile: "plop-templates/model.ts",
};

const createIntegrationTest = {
  type: "add",
  path: `tests/{{module}}/{{kebabCase name}}.integration.spec.ts`,
  templateFile: "plop-templates/integration-test.ts",
};

const createEventSubscriber = [
  {
    type: "add",
    path: `{{module}}/subscribers/{{kebabCase name}}.subscriber.ts`,
    templateFile: "plop-templates/events/event-subscriber.ts",
  },
  {
    type: "modify",
    path: subscribersLocation,
    pattern: /(\/\/ SUBSCRIBERS_IMPORTS)/,
    template:
      'import {{pascalCase name}}EventSubscriber from "../app/features/{{ getModuleName module }}/subscribers/{{kebabCase name}}.subscriber";\n$1',
  },
  {
    type: "modify",
    path: subscribersLocation,
    pattern: /(\/\/ SUBSCRIBERS_SETUP)/,
    template: "awilix.asClass({{pascalCase name}}EventSubscriber),\n      $1",
  },
];

const updateRootRouter = [
  {
    type: "modify",
    path: `${routesLocation}/router.ts`,
    pattern: /(\/\/ ROUTES_CONFIG)/,
    template: 'router.use("/{{kebabCase name}}", {{camelCase name}}Routing);\n  $1',
  },
  {
    type: "modify",
    path: `${routesLocation}/router.ts`,
    pattern: /(\/\/ ROUTES_DEPENDENCIES)/,
    template: "{{camelCase name}}Routing,\n  $1",
  },
  {
    type: "modify",
    path: `${routesLocation}/router.ts`,
    pattern: /(\/\/ ROUTES_INTERFACE)/,
    template: "{{camelCase name}}Routing: express.Router;\n  $1",
  },
];

const updateContainerRoutes = [
  {
    type: "modify",
    path: routingLocation,
    pattern: /(\/\/ ROUTING_IMPORTS)/,
    template: 'import { {{camelCase name}}Routing } from "../app/features/{{kebabCase name}}/routing";\n$1',
  },
  {
    type: "modify",
    path: routingLocation,
    pattern: /(\/\/ ROUTING_SETUP)/,
    template: "{{camelCase name}}Routing: awilix.asFunction({{camelCase name}}Routing),\n  $1",
  },
];

const updateContainerModels = [
  {
    type: "modify",
    path: databaseLocation,
    pattern: /(\/\/ MODELS_IMPORTS)/,
    template:
      'import { {{pascalCase name}}Model } from "../app/features/{{getModuleName module}}/models/{{kebabCase name}}.model";\n$1',
  },
  {
    type: "modify",
    path: databaseLocation,
    pattern: /(\/\/ MODELS_SETUP)/,
    template:
      "{{camelCase name}}Repository: awilix.asValue(dbConnection.getRepository({{pascalCase name}}Model)),\n    $1",
  },
];

const updateGraphqlResolverForQuery = [
  {
    type: "modify",
    path: graphqlResolverLocation,
    pattern: /(\/\/ QUERY_IMPORTS)/,
    template:
      'import { {{camelCase name}}Query } from "../../app/features/{{getModuleName module}}/graphql/queries/{{kebabCase name}}.query";\n$1',
  },
  {
    type: "modify",
    path: graphqlResolverLocation,
    pattern: /(\/\/ GRAPHQL_QUERIES)/,
    template: "{{camelCase name}}: {{camelCase name}}Query,\n      $1",
  },
];

const updateGraphqlResolverForMutation = [
  {
    type: "modify",
    path: graphqlResolverLocation,
    pattern: /(\/\/ MUTATION_IMPORTS)/,
    template:
      'import { {{camelCase name}}Mutation } from "../../app/features/{{getModuleName module}}/graphql/mutations/{{kebabCase name}}.mutation";\n$1',
  },
  {
    type: "modify",
    path: graphqlResolverLocation,
    pattern: /(\/\/ GRAPHQL_MUTATIONS)/,
    template: "{{camelCase name}}: {{camelCase name}}Mutation,\n      $1",
  },
];

const updateModuleRouter = [
  {
    type: "modify",
    path: "{{module}}/routing.ts",
    pattern: /(\/\/ VALIDATION_IMPORTS)/,
    template: 'import { {{camelCase name}}ActionValidation } from "./actions/{{kebabCase name}}.action";\n$1',
  },
  {
    type: "modify",
    path: "{{module}}/routing.ts",
    pattern: /(\/\/ ACTIONS_SETUP)/,
    template:
      'router.{{method}}("/{{kebabCase name}}", [{{camelCase name}}ActionValidation], actions.{{camelCase name}}Action.invoke.bind(actions.{{camelCase name}}Action));\n  $1',
  },
  {
    type: "modify",
    path: "{{module}}/routing.ts",
    pattern: /(\/\/ ACTIONS_IMPORTS)/,
    template: "{{camelCase name}}Action: Action;\n  $1",
  },
];

const setupModuleStructure = [
  {
    type: "makeDir",
    configProp: "",
  },
  {
    type: "makeDir",
    configProp: "handlers",
  },
  {
    type: "makeDir",
    configProp: "commands",
  },
  {
    type: "makeDir",
    configProp: "events",
  },
  {
    type: "makeDir",
    configProp: "actions",
  },
  {
    type: "makeDir",
    configProp: "models",
  },
];

// PROMPTS
const moduleListPrompt = {
  type: "list",
  name: "module",
  message: "What is your feature name?",
  default: directories[0],
  choices: directories.map((name) => ({ name: NAME_REGEX.exec(name)[0], value: name })),
};

const textPrompt = (name) => ({
  type: "input",
  name: "name",
  message: `What is your ${name} name?`,
  validate: isNotEmptyFor("name"),
});

const methodPrompt = {
  type: "list",
  name: "method",
  message: "What is your action type?",
  default: "get",
  choices: [
    { name: "get", value: "get" },
    { name: "post", value: "post" },
    { name: "delete", value: "delete" },
    { name: "patch", value: "patch" },
    { name: "put", value: "put" },
  ],
};

module.exports = (plop) => {
  plop.setActionType("makeDir", function (answers, { configProp }) {
    const absolutePath = path.join(`${routesLocation}/features`, kebabCase(answers.name), configProp);
    return mkdirSync(absolutePath);
  });

  plop.setHelper("eq", function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });

  plop.setHelper("capitalize", function (text) {
    return typeof text === "string" ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  });

  plop.setHelper("uppercase", function (text) {
    return typeof text === "string" ? text.toUpperCase() : text;
  });

  plop.setHelper("downcase", function (text) {
    return typeof text === "string" ? text.toLowerCase() : text;
  });

  plop.setHelper("getModuleName", function (text) {
    return typeof text === "string" ? text.split("/").reverse()[0] : text;
  });

  plop.setHelper("getName", function (text) {
    const name = NAME_REGEX.exec(text);
    return !!name[0] ? name[0] : text;
  });

  plop.setGenerator("action+command+handler", {
    prompts: [moduleListPrompt, textPrompt("action+command+handler"), methodPrompt],
    actions: [createAction, ...updateModuleRouter, createCommand, createEvent, ...createCommandHandler],
  });

  plop.setGenerator("action+query+handler", {
    prompts: [moduleListPrompt, textPrompt("action+query+handler"), methodPrompt],
    actions: [createAction, ...updateModuleRouter, ...createQuery, ...createQueryHandler],
  });

  plop.setGenerator("graphql+query+handler", {
    prompts: [moduleListPrompt, textPrompt("graphql+query+handler")],
    actions: [createGraphqlQuery, ...updateGraphqlResolverForQuery, ...createQuery, ...createQueryHandler],
  });

  plop.setGenerator("graphql+command+handler", {
    prompts: [moduleListPrompt, textPrompt("graphql+command+handler")],
    actions: [createGraphqlMutation, ...updateGraphqlResolverForMutation, createCommand, ...createCommandHandler],
  });

  plop.setGenerator("model", {
    prompts: [moduleListPrompt, textPrompt("model")],
    actions: [createModel, ...updateContainerModels],
  });

  plop.setGenerator("feature", {
    prompts: [textPrompt("feature")],
    actions: [
      ...setupModuleStructure,
      createRouting,
      ...updateRootRouter,
      ...updateContainerRoutes,
      createIntegrationTest,
    ],
  });

  plop.setGenerator("action", {
    prompts: [moduleListPrompt, textPrompt("action"), methodPrompt],
    actions: [createAction, ...updateModuleRouter],
  });

  plop.setGenerator("command", {
    prompts: [moduleListPrompt, textPrompt("command")],
    actions: [createCommand],
  });

  plop.setGenerator("command handler", {
    prompts: [moduleListPrompt, textPrompt("command handler")],
    actions: [...createCommandHandler],
  });

  plop.setGenerator("query", {
    prompts: [moduleListPrompt, textPrompt("query")],
    actions: [...createQuery],
  });

  plop.setGenerator("query handler", {
    prompts: [moduleListPrompt, textPrompt("query handler")],
    actions: [...createQueryHandler],
  });

  plop.setGenerator("query with handler", {
    prompts: [moduleListPrompt, textPrompt("query handler")],
    actions: [...createQueryHandler, ...createQuery],
  });

  plop.setGenerator("event subscriber", {
    prompts: [moduleListPrompt, textPrompt("event subscriber")],
    actions: [...createEventSubscriber],
  });

  plop.setGenerator("graphql-query", {
    prompts: [moduleListPrompt, textPrompt("graphql-query")],
    actions: [createGraphqlQuery],
  });

  plop.setGenerator("graphql-mutation", {
    prompts: [moduleListPrompt, textPrompt("graphql-mutation")],
    actions: [createGraphqlMutation],
  });
};
