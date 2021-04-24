import { AwilixContainer, asClass } from "awilix";
import { asArray } from "@tshio/awilix-resolver";

import UsersQueryHandler from "../app/features/example/query-handlers/users.query.handler";
// HANDLERS_IMPORTS

export async function registerQueryHandlers(container: AwilixContainer) {
  container.register({
    queryHandlers: asArray<any>([
      asClass(UsersQueryHandler),
      // QUERY_HANDLERS_SETUP
    ]),
  });

  return container;
}
