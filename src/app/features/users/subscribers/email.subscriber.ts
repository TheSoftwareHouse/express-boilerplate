import { Event, EventSubscriberInterface, EventSubscribersMeta } from "../../../../shared/event-dispatcher";
import { Logger } from "../../../../shared/logger";

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
   *  { 'name': 'TestEvent', method: 'sendEmail' }
   * ]
   */
  getSubscribedEvents(): EventSubscribersMeta[] {
    return [{ name: "UserLoggedIn", method: "logUserLogin" }];
  }

  public async logUserLogin(event: Event) {
    this.dependencies.logger.info("User logged in", event.payload);
  }
}
