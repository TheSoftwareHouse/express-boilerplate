import { EventDispatcher } from "@tshio/event-dispatcher";
import { CommandHandler } from "@tshio/command-bus";
import { LOGIN_COMMAND_TYPE, LoginCommand } from "../commands/login.command";
import UserLoggedInEvent from "../events/user-logged-in.event";

export interface LoginHandlerDependencies {
  eventDispatcher: EventDispatcher;
}

export default class LoginCommandHandler implements CommandHandler<LoginCommand> {
  public commandType: string = LOGIN_COMMAND_TYPE;

  private eventDispatcher: EventDispatcher;

  constructor({ eventDispatcher }: LoginHandlerDependencies) {
    this.eventDispatcher = eventDispatcher;
  }

  async execute(command: LoginCommand) {
    await this.eventDispatcher.dispatch(new UserLoggedInEvent(command));

    return {
      ...command,
    };
  }
}
