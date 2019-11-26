import { Event, EventSubscriberInterface, EventSubscribersMeta } from "../../../../shared/event-dispatcher";

type {{pascalCase name}}EventSubscriberProps = {}

export default class {{ pascalCase name}}EventSubscriber implements EventSubscriberInterface {
  public constructor(private dependencies: {{pascalCase name}}EventSubscriberProps) {}
  /**
   * Register events and listeners
   * @example
   * return [
   *  { 'name': 'TestEvent', method: 'sendEmail' }
   * ]
   */
  getSubscribedEvents(): EventSubscribersMeta[] {
    throw new Error("Method not implemented.");
  }
}
