import { EventSubscriberInterface, EventSubscribersMeta } from "../../../../shared/event-dispatcher";
import { Logger } from "../../../../shared/logger";
import {{pascalCase name}}Event from "../events/{{kebabCase name}}.event"

type {{pascalCase name}}EventSubscriberDependencies = {
  logger: Logger;
};

/**
 * Example subscriber
 */
export default class {{pascalCase name}}EventSubscriber implements EventSubscriberInterface {
  public constructor(private dependencies: {{pascalCase name}}EventSubscriberDependencies) {}

  /**
   * Register events and listeners
   * @example
   * return [
   *  { 'name': 'TestEvent', method: 'sendEmail' }
   * ]
   */
  getSubscribedEvents(): EventSubscribersMeta[] {
    return [{ name: {{pascalCase name}}Event.getName, method: "log{{pascalCase name}}" }];
  }

  public async log{{pascalCase name}}(event: {{pascalCase name}}Event) {
    this.dependencies.logger.info("{{pascalCase name}} event logged", event.payload);
  }
}
