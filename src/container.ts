import * as awilix from "awilix";
import { config as dotenvConfig } from "dotenv-safe";
import { AwilixContainer, Lifetime } from "awilix";
import { createConnection } from "typeorm";
import { makeApiConfig } from "../config/services";
import { CommandBus } from './shared/command-bus'
import { createRouter } from "./app/router";
import { winstonLogger } from "./shared/logger";
import { errorHandler } from "./middleware/error-handler";
import { UserDetailsModel } from "./app/users/models/user-details.model";
import { AuthenticationService } from "./app/services/authentication.service";
import { ExternalAuthenticationMock } from "./tools/external-authentication-mock/external-authentication-mock";
import { UserRoleModel } from "./app/users/models/user-role.model";
// MODELS_IMPORTS

import { usersRouting } from "./app/users/routing";
// ROUTING_IMPORTS

dotenvConfig({
  example: ".env.dist",
});

const config = makeApiConfig(process.env);
const dbConfig = require('../config/db');

const HANDLER_REGEX = /.+Handler$/;

export async function createContainer(): Promise<AwilixContainer> {
  const container: AwilixContainer = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  container.register({
    port: awilix.asValue(config.port),
    externalAuthSecret: awilix.asValue(config.externalAuthSecret),
    accessTokenKey: awilix.asValue(config.accessTokenKey),
    refreshTokenKey: awilix.asValue(config.refreshTokenKey),
    accessTokenExpirationTime: awilix.asValue(config.accessTokenExpirationTime),
    logger: awilix.asValue(winstonLogger),
  });

  const dbConnection = await createConnection(dbConfig);

  container.register({
    userDetailsRepository: awilix.asValue(dbConnection.getRepository(UserDetailsModel)),
    userRoleRepository: awilix.asValue(dbConnection.getRepository(UserRoleModel)),
    // MODELS_SETUP
  });

  container.register({
    externalAuthService: awilix.asClass(ExternalAuthenticationMock).classic(),

  });
  container.register({
    authenticationService: awilix.asClass(AuthenticationService),
  });

  const handlersScope = container.createScope();

  handlersScope.loadModules([ "src/**/*.handler.ts", "src/**/*.handler.js" ], {
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
    router: awilix.asFunction(createRouter),
    commandBus: awilix.asClass(CommandBus).classic().singleton(),
  });

  return container;
}
