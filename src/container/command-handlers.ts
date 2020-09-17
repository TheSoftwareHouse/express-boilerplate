import { AwilixContainer } from "awilix";
import * as awilix from "awilix";
import { asArray } from "../shared/awilix-resolvers";

import LoginHandler from "../app/features/users/handlers/login.handler";
import DeleteUserHandleer from "../app/features/users/handlers/delete-user.handler";
// HANDLERS_IMPORTS

export async function registerCommandHandlers(container: AwilixContainer) {
  container.register({
    commandHandlers: asArray<any>([
      awilix.asClass(LoginHandler),
      awilix.asClass(DeleteUserHandleer),
      // COMMAND_HANDLERS_SETUP
    ]),
  });

  return container;
}
