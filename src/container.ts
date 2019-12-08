import * as awilix from "awilix";
import { AwilixContainer, Lifetime, Resolver } from "awilix";
import { Application } from "express";
import * as http from "http";
import { createConnection, ConnectionOptions } from "typeorm";
import { makeApiConfig } from "../config/services";
import { createApp } from "./app/app";
import { createRouter } from "./app/router";
import { errorHandler } from "./middleware/error-handler";
import { CommandBus } from "./shared/command-bus";
import { winstonLogger } from "./shared/logger";
import { QueryBus } from "./shared/query-bus";
import { EventDispatcher } from "./shared/event-dispatcher";
// MODELS_IMPORTS

import { usersRouting } from "./app/features/users/routing";
// ROUTING_IMPORTS

import LoginCommandHandler from "./app/features/users/handlers/login.handler";
import UsersQueryHandler from "./app/features/users/query-handlers/users.query.handler";
// HANDLERS_IMPORTS

import EmailEventSubscriber from "./app/features/users/subscribers/email.subscriber";
// SUBSCRIBERS_IMPORTS

import { cacheClient } from "./tools/cache-client";
import * as db from "../config/db";

const config = makeApiConfig();

function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
  return {
    resolve: (container: AwilixContainer) => resolvers.map((r: Resolver<T>) => container.build(r))
  };
}

export async function createContainer(): Promise<AwilixContainer> {
  const container: AwilixContainer = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  container.register({
    cacheClient: awilix.asValue(cacheClient)
  });

  const dbConnection = await createConnection(db as ConnectionOptions);
  await dbConnection.runMigrations();

  container.register({
    port: awilix.asValue(config.port),
    logger: awilix.asValue(winstonLogger),
  });

  container.loadModules([ 
    "src/**/*.action.ts",
    "src/**/*.action.js"
  ], {
    formatName: "camelCase",
    resolverOptions: {
      lifetime: Lifetime.SCOPED,
      register: awilix.asFunction,
    },
  });

  container.register({
    usersRouting: awilix.asFunction(usersRouting),
    // ROUTING_SETUP
  });

  container.register({
    errorHandler: awilix.asFunction(errorHandler),
    router: awilix.asFunction(createRouter),
    queryBus: awilix.asClass(QueryBus).classic().singleton(),
    eventSubscribers: asArray([
      awilix.asClass(EmailEventSubscriber),
      // SUBSCRIBERS_SETUP
    ]),
    eventDispatcher: awilix.asClass(EventDispatcher).classic().singleton(),
    commandHandlers: asArray([
      awilix.asClass(LoginCommandHandler),
      // COMMAND_HANDLERS_SETUP
    ]),
    commandBus: awilix.asClass(CommandBus).classic().singleton(),
    queryHandlers: asArray([
      awilix.asClass(UsersQueryHandler),
      // QUERY_HANDLERS_SETUP
    ]),
    // MODELS_SETUP
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
