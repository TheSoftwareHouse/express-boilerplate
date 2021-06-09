import { Event } from "@tshio/event-dispatcher";

export default class {{pascalCase name}}Event implements Event {
  static eventName: string = "{{pascalCase name}}";

  public payload: any;

  get name() {
    return {{pascalCase name}}Event.eventName;
  }

  public constructor(payload: any) {
    this.payload = payload;
  }
}
