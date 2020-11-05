import { AwilixContainer } from "awilix";
import * as awilix from "awilix";
import { asArray } from "../shared/awilix-resolvers";

import EmailSubscriber from "../app/features/users/subscribers/email.subscriber";
// SUBSCRIBERS_IMPORTS

export async function registerSubscribers(container: AwilixContainer) {
  container.register({
    eventSubscribers: asArray<any>([
      awilix.asClass(EmailSubscriber).singleton(),
      // SUBSCRIBERS_SETUP
    ]),
  });

  return container;
}
