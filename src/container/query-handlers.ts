import { AwilixContainer } from "awilix";
import * as awilix from "awilix";
import { asArray } from "@tshio/awilix-resolver";

import UsersQueryHandler from "../app/features/example/query-handlers/users.query.handler";
// HANDLERS_IMPORTS

const queryHandlers = [
  UsersQueryHandler,
  // QUERY_HANDLERS_SETUP
];

export type RegisteredQueryHandlers = typeof queryHandlers[number];

export async function registerQueryHandlers(container: AwilixContainer) {
  container.register({
    queryHandlers: asArray<any>(queryHandlers.map((handler) => awilix.asClass(handler))),
  });

  return container;
}
