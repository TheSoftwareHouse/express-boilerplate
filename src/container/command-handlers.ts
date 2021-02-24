import { AwilixContainer } from "awilix";
import * as awilix from "awilix";
import { asArray } from "@tshio/awilix-resolver";

import LoginHandler from "../app/features/example/handlers/login.handler";
import DeleteUserHandler from "../app/features/example/handlers/delete-user.handler";
// HANDLERS_IMPORTS

const commandHandlers = [
  LoginHandler,
  DeleteUserHandler,
  // COMMAND_HANDLERS_SETUP
];

export type RegisteredCommandHandlers = typeof commandHandlers[number];

export async function registerCommandHandlers(container: AwilixContainer) {
  container.register({
    commandHandlers: asArray<any>(commandHandlers.map((handler) => awilix.asClass(handler as any))),
  });

  return container;
}
