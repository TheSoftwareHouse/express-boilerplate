const {lstatSync, readdirSync} = require('fs');
const path = require('path');
const chalk = require('chalk');

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);

const routesLocation = path.join(__dirname, 'src/app/routes');
const directories = getDirectories(routesLocation);

const isNotEmptyFor = name => {
  return value => {
    if (!(value.snakeCased.trim())) return name + ' is required';
    return true
  }
};

const NAME_REGEX = /[^\/]+$/;
const SNAKE_REGEX = /\-(.)/g;

// ACTIONS

const createAction = {
  type: 'add',
  path: '{{module}}/actions/{{name.snakeCased}}.action.ts',
  templateFile: 'plop-templates/action.ts',
};

const createCommand = {
  type: 'add',
  path: '{{module}}/commands/{{name.snakeCased}}.command.ts',
  templateFile: 'plop-templates/command.ts',
};

const createHandler = {
  type: 'add',
  path: '{{module}}/handlers/{{name.snakeCased}}.handler.ts',
  templateFile: 'plop-templates/handler.ts',
};

// PROMPTS
const namePrompt = {
  type: 'list',
  name: 'module',
  message: 'What is your module name?',
  default: directories[0],
  choices: directories.map(name => ({name: NAME_REGEX.exec(name)[0], value: name})),
};

const modulePrompt = {
  type: 'input',
  name: 'name',
  message: 'What is your action name?',
  validate: isNotEmptyFor('name'),
  filter: text => ({
    camelCased: (text || "").replace(SNAKE_REGEX, ((_, match) => match.toUpperCase())),
    pascalKebab: (text || "").replace(SNAKE_REGEX, ((_, match) => `_${match.toUpperCase()}`)).toUpperCase(),
    snakeCased: text,
  }),
};

console.log(chalk.red.bold("PLEASE USE SNAKE CASE!"));

module.exports = plop => {
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

  plop.setGenerator('action', {
    prompts: [
      namePrompt,
      modulePrompt,
    ],
    actions: [
      createAction,
    ]
  });

  plop.setGenerator('command', {
    prompts: [
      namePrompt,
      modulePrompt,
    ],
    actions: [
      createCommand,
    ]
  });

  plop.setGenerator('handler', {
    prompts: [
      namePrompt,
      modulePrompt,
    ],
    actions: [
      createHandler,
    ]
  });
};
