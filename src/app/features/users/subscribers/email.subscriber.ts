import { Event, EventSubscriberInterface, EventSubscribersMeta } from "../../../../shared/event-dispatcher";
import { Logger } from "../../../../shared/logger";

type EmailEventSubscriberProps = {
  logger: Logger;
};

/**
 * Example subscriber
 */
export default class EmailEventSubscriber implements EventSubscriberInterface {
  public constructor(private dependencies: EmailEventSubscriberProps) {}

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
