import { AwilixContainer } from "awilix";
import * as awilix from "awilix";
import { asArray } from "../shared/awilix-resolvers";

import UsersQueryHandler from "../app/features/users/query-handlers/users.query.handler";
// HANDLERS_IMPORTS

export async function registerQueryHandlers(container: AwilixContainer) {
  container.register({
    queryHandlers: asArray<any>([
      awilix.asClass(UsersQueryHandler),
      // QUERY_HANDLERS_SETUP
    ]),
  });

  return container;
}
