import { EventSubscriberInterface, EventSubscribersMeta } from "@tshio/event-dispatcher";
import { Logger } from "@tshio/logger";
import UserLoggedInEvent from "../events/user-logged-in.event";

type EmailEventSubscriberDependencies = {
  logger: Logger;
};

/**
 * Example subscriber
 */
export default class EmailEventSubscriber implements EventSubscriberInterface {
  public constructor(private dependencies: EmailEventSubscriberDependencies) {}

  /**
   * Register events and listeners
   * @example
   * return [
   *  { name: TestEvent.eventName, method: "sendEmail" }
   * ]
   */
  getSubscribedEvents(): EventSubscribersMeta[] {
    return [{ name: UserLoggedInEvent.eventName, method: "logUserLogin" }];
  }

  public async logUserLogin(event: UserLoggedInEvent) {
    const { logger } = this.dependencies;

    logger.info("User logged in", event.payload);
  }
}
