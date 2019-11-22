import * as awilix from "awilix";
import * as http from "http";
import { AwilixContainer, Lifetime } from "awilix";
import { Application } from "express";
import { makeApiConfig } from "../config/services";
import { CommandBus } from "./shared/command-bus";
import { QueryBus } from "./shared/query-bus";
import { createRouter } from "./app/router";
import { winstonLogger } from "./shared/logger";
import { errorHandler } from "./middleware/error-handler";
import { createApp } from "./app/app";
// MODELS_IMPORTS

import { usersRouting } from "./app/features/users/routing";
// ROUTING_IMPORTS

const config = makeApiConfig();

const COMMAND_HANDLER_REGEX = /.+CommandHandler$/;
const QUERY_HANDLER_REGEX = /.+QueryHandler$/;

export async function createContainer(): Promise<AwilixContainer> {
  const container: AwilixContainer = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  container.register({
    port: awilix.asValue(config.port),
    logger: awilix.asValue(winstonLogger),
  });

  const handlersScope = container.createScope();

  handlersScope.loadModules([ "src/**/*.handler.ts", "src/**/*.handler.js" ], {
    formatName: "camelCase",
    resolverOptions: {
      lifetime: Lifetime.SCOPED,
      register: awilix.asClass,
    },
  });

  const commandHandlers = Object.keys(handlersScope.registrations)
    .filter(key => key.match(COMMAND_HANDLER_REGEX) && !key.match(QUERY_HANDLER_REGEX))
    .map(key => handlersScope.resolve(key));

  const queryHandlers = Object.keys(handlersScope.registrations)
    .filter(key => key.match(QUERY_HANDLER_REGEX))
    .map(key => handlersScope.resolve(key)); 

  container.register({
    commandHandlers: awilix.asValue(commandHandlers),
    queryHandlers: awilix.asValue(queryHandlers)
  });

  container.register({
    usersRouting: awilix.asFunction(usersRouting),
    // ROUTING_SETUP
  });

  container.register({
    errorHandler: awilix.asFunction(errorHandler),
    router: awilix.asFunction(createRouter),
    commandBus: awilix.asClass(CommandBus).classic().singleton(),
    queryBus: awilix.asClass(QueryBus).classic().singleton(),
  });

  container.register({
    app: awilix.asFunction(createApp).singleton(),
  });

  const app: Application = container.resolve("app");

  container.register({
    server: awilix.asValue(http.createServer(app)),
  });

  return container;
}
