import * as awilix from "awilix";
import { AwilixContainer, Lifetime } from "awilix";
import { createConnection } from "typeorm";
import { config } from "../config/services";
import { CommandBus } from './shared/command-bus'
import { router } from "./app/router";
import { winstonLogger } from "./shared/logger";
import { errorHandler } from "./middleware/error-handler";
import { UserDetailsModel } from "./app/users/models/user-details.model";
import { UserRoleModel } from "./app/users/models/user-role.model";
// MODELS_IMPORTS

import { usersRouting } from "./app/users/routing";
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
    userDetailsRepository: awilix.asValue(dbConnection.getRepository(UserDetailsModel)),
userRoleRepository: awilix.asValue(dbConnection.getRepository(UserRoleModel)),
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
    usersRouting: awilix.asFunction(usersRouting),
// ROUTING_SETUP
  });

  container.register({
    errorHandler: awilix.asFunction(errorHandler),
    router: awilix.asFunction(router),
    commandBus: awilix.asClass(CommandBus).classic().singleton(),
  });

  return container;
}
