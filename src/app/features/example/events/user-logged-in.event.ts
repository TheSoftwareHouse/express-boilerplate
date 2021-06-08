import { Event } from "@tshio/event-dispatcher";
import { LoginCommand } from "../commands/login.command";

export default class UserLoggedInEvent implements Event {
  static eventName: string = "UserLoggedIn";

  public payload: LoginCommand;

  get name() {
    return UserLoggedInEvent.eventName;
  }

  public constructor(command: LoginCommand) {
    this.payload = command;
  }
}
