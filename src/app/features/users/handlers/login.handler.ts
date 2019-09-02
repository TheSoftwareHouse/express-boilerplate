import { Handler } from "../../../../shared/command-bus";
import { LOGIN_COMMAND_TYPE, LoginCommand } from "../commands/login.command";

export interface LoginHandlerProps {}

export default class LoginHandler implements Handler<LoginCommand> {
  public commandType: string = LOGIN_COMMAND_TYPE;

  async execute(command: LoginCommand) {
    return {
      ...command
    }
  }
}
