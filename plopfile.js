const {lstatSync, readdirSync, mkdirSync} = require('fs');
const path = require('path');
const chalk = require('chalk');

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

const routesLocation = path.join(__dirname, 'src/app/routes');
const modelsLocation = path.join(__dirname, 'src/infrastructure/models');
const containerLocation = path.join(__dirname, 'src/container.ts');
const directories = getDirectories(routesLocation);

const isNotEmptyFor = name => {
  return value => {
    if (!(value.kebabCased.trim())) return name + ' is required';
    return true
  }
};

const NAME_REGEX = /[^\/]+$/;
const SNAKE_REGEX = /\-(.)/g;

// ACTIONS

const createAction = {
  type: 'add',
  path: '{{module}}/actions/{{name.kebabCased}}.action.ts',
  templateFile: 'plop-templates/action.ts',
};

const createCommand = {
  type: 'add',
  path: '{{module}}/commands/{{name.kebabCased}}.command.ts',
  templateFile: 'plop-templates/command.ts',
};

const createHandler = {
  type: 'add',
  path: '{{module}}/handlers/{{name.kebabCased}}.handler.ts',
  templateFile: 'plop-templates/handler.ts',
};

const createRouting = {
  type: 'add',
  path: `${routesLocation}/{{name.kebabCased}}/{{name.kebabCased}}.routing.ts`,
  templateFile: 'plop-templates/routing.ts',
};

const createModel = {
  type: 'add',
  path: `${modelsLocation}/{{name.kebabCased}}/{{name.kebabCased}}.model.ts`,
  templateFile: 'plop-templates/model.ts',
};

const updateRootRouter = [{
  type: 'modify',
  path: `${routesLocation}/index.ts`,
  pattern: /(\/\/ ROUTES_CONFIG)/,
  template: 'router.use({{name.camelCased}});\n$1',
}, {
  type: 'modify',
  path: `${routesLocation}/index.ts`,
  pattern: /(\/\/ ROUTES_DEPENDENCIES)/,
  template: '{{name.camelCased}},\n$1',
}, {
  type: 'modify',
  path: `${routesLocation}/index.ts`,
  pattern: /(\/\/ ROUTES_INTERFACE)/,
  template: '{{name.camelCased}}: Router;\n$1',
}];

const updateContainerRoutes = [{
  type: 'modify',
  path: containerLocation,
  pattern: /(\/\/ ROUTING_IMPORTS)/,
  template: 'import { {{name.camelCased}}Routing } from "./app/routes/{{name.kebabCased}}/{{name.kebabCased}}.routing";\n$1',
}, {
  type: 'modify',
  path: containerLocation,
  pattern: /(\/\/ ROUTING_SETUP)/,
  template: '{{name.camelCased}}Routing: awilix.asFunction({{name.camelCased}}Routing),\n$1',
}];

const updateContainerModels = [{
  type: 'modify',
  path: containerLocation,
  pattern: /(\/\/ MODELS_IMPORTS)/,
  template: 'import { {{capitalize name.camelCased}}Model } from "./infrastructure/models/{{name.kebabCased}}/{{name.kebabCased}}.model";\n$1',
}, {
  type: 'modify',
  path: containerLocation,
  pattern: /(\/\/ MODELS_SETUP)/,
  template: '{{name.camelCased}}Repository: awilix.asValue(dbConnection.getRepository({{capitalize name.camelCased}}Model)),\n$1',
}];


const updateModuleRouter = [{
  type: 'modify',
  path: '{{module}}/{{getName module}}.routing.ts',
  pattern: /(\/\/ COMMAND_IMPORTS)/,
  template: 'import { {{name.camelCased}}Action } from "./actions/{{name.kebabCased}}.action";\n$1',
}, {
  type: 'modify',
  path: '{{module}}/{{getName module}}.routing.ts',
  pattern: /(\/\/ COMMANDS_SETUP)/,
  template: 'router.{{method}}(\'/{{name.kebabCased}}\', {{name.camelCased}}Action({commandBus}));\n$1',
}];

const setupModuleStructure = [
  {
    type: 'makeDir',
    configProp: '',
  },
  {
    type: 'makeDir',
    configProp: 'handlers',
  },
  {
    type: 'makeDir',
    configProp: 'commands',
  },
  {
    type: 'makeDir',
    configProp: 'actions',
  },
];

// PROMPTS
const moduleListPrompt = {
  type: 'list',
  name: 'module',
  message: 'What is your module name?',
  default: directories[0],
  choices: directories.map(name => ({name: NAME_REGEX.exec(name)[0], value: name})),
};

const textPrompt = (name) => ({
  type: 'input',
  name: 'name',
  message: `What is your ${name} name?`,
  validate: isNotEmptyFor('name'),
  filter: text => ({
    camelCased: (text || "").replace(SNAKE_REGEX, ((_, match) => match.toUpperCase())),
    capitalSnake: (text || "").replace(SNAKE_REGEX, ((_, match) => `_${match.toUpperCase()}`)).toUpperCase(),
    kebabCased: text,
  }),
});

const mothodPrompt = {
  type: 'list',
  name: 'method',
  message: 'What is your action type?',
  default: 'get',
  choices: [
    { name: 'get', value: 'get'},
    { name: 'post', value: 'post'},
    { name: 'delete', value: 'delete'},
    { name: 'patch', value: 'patch'},
    { name: 'put', value: 'put'},
  ],
};

console.log(chalk.red.bold("PLEASE USE KEBAB CASE!"));

module.exports = plop => {
  plop.setActionType('makeDir', function (answers, {configProp}) {
    const absolutePath = path.join(routesLocation, answers.name.kebabCased, configProp);
    return mkdirSync(absolutePath);
  });

  plop.setHelper('capitalize', function (text) {
    return typeof text === 'string' ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  });

  plop.setHelper('uppercase', function (text) {
    return typeof text === 'string' ? text.toUpperCase() : text;
  });

  plop.setHelper('downcase', function (text) {
    return typeof text === 'string' ? text.toLowerCase() : text;
  });

  plop.setHelper('getName', function (text) {
    const name = NAME_REGEX.exec(text);
    return !!name[0] ? name[0] : text;
  });

  plop.setGenerator('set', {
    prompts: [
      moduleListPrompt,
      textPrompt("set"),
      mothodPrompt,
    ],
    actions: [
      createAction,
      ...updateModuleRouter,
      createCommand,
      createHandler,
    ]
  });

  plop.setGenerator('model', {
    prompts: [
      textPrompt("model"),
    ],
    actions: [
      createModel,
      ...updateContainerModels,
    ]
  });

  plop.setGenerator('route', {
    prompts: [
      textPrompt("route"),
    ],
    actions: [
      ...setupModuleStructure,
      createRouting,
      ...updateRootRouter,
      ...updateContainerRoutes,
    ]
  });

  plop.setGenerator('action', {
    prompts: [
      moduleListPrompt,
      textPrompt("action"),
      mothodPrompt,
    ],
    actions: [
      createAction,
      ...updateModuleRouter,
    ]
  });

  plop.setGenerator('command', {
    prompts: [
      moduleListPrompt,
      textPrompt("command"),
    ],
    actions: [
      createCommand,
    ]
  });

  plop.setGenerator('handler', {
    prompts: [
      moduleListPrompt,
      textPrompt("handler"),
    ],
    actions: [
      createHandler,
    ]
  });
};
