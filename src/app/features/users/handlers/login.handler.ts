import { CommandHandler } from "../../../../shared/command-bus";
import { LOGIN_COMMAND_TYPE, LoginCommand } from "../commands/login.command";
import { EventDispatcher } from "../../../../shared/event-dispatcher";

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
    await this.eventDispatcher.dispatch({
      name: "UserLoggedIn",
      payload: command,
    });

    return {
      ...command,
    };
  }
}
