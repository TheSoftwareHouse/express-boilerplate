import * as awilix from "awilix";
import { AwilixContainer, Lifetime } from "awilix";
import { createConnection } from "typeorm";
import { config } from "../config/services";
import appCommandBus from "./app/app-command-bus/app-command-bus";
import { routing } from "./app/routes";
import { winstonLogger } from "./shared/logger";
import { errorHandler } from "./middleware/error-handler";
import { UserDetailsModel } from "./infrastructure/models/user-details/user-details.model";
// MODELS_IMPORTS

// ROUTING_IMPORTS

const dbConfig = require('../config/db');

const HANDLER_REGEX = /.+Handler$/;

export async function createContainer(): Promise<AwilixContainer> {
  const container: AwilixContainer = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  container.register({
    port: awilix.asValue(config.percentApi.port),
    logger: awilix.asValue(winstonLogger),
  });

  const dbConnection = await createConnection(dbConfig);

  container.register({
    usersRepository: awilix.asValue(dbConnection.getRepository(UserDetailsModel)),
    // MODELS_SETUP
  });

  const handlersScope = container.createScope();

  handlersScope.loadModules(["src/**/*.handler.ts", "src/**/*.handler.js"], {
    formatName: "camelCase",
    resolverOptions: {
      lifetime: Lifetime.SCOPED,
      register: awilix.asClass,
    },
  });

  const handlers = Object.keys(handlersScope.registrations)
    .filter(key => key.match(HANDLER_REGEX))
    .map(key => handlersScope.resolve(key));

  container.register({
    handlers: awilix.asValue(handlers),
  });

  container.register({
    // ROUTING_SETUP
  });

  container.register({
    errorHandler: awilix.asFunction(errorHandler),
    routing: awilix.asFunction(routing),
    commandBus: awilix.asFunction(appCommandBus),
  });

  return container;
}
