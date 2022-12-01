import { EventSubscriberInterface, EventSubscribersMeta } from "@tshio/event-dispatcher";
import { Logger } from "@tshio/logger";
import {{pascalCase name}}Event from "../events/{{kebabCase name}}.event";

type {{pascalCase name}}EventSubscriberDependencies = {
  logger: Logger;
};

export default class {{pascalCase name}}EventSubscriber implements EventSubscriberInterface {
  public constructor(private dependencies: {{pascalCase name}}EventSubscriberDependencies) {}

  getSubscribedEvents(): EventSubscribersMeta[] {
    return [{ name: {{pascalCase name}}Event.eventName, method: "log{{pascalCase name}}" }];
  }

  public async log{{pascalCase name}}(event: {{pascalCase name}}Event) {
    this.dependencies.logger.info("{{pascalCase name}} event logged", event.payload);
  }
}
