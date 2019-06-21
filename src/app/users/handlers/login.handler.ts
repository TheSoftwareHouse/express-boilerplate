import { Handler } from "../../../shared/command-bus";
import { LOGIN_COMMAND_TYPE, LoginCommand } from "../commands/login.command";
import { AuthenticationService } from "../../services/authentication.service";

export interface LoginHandlerProps {
  authenticationService: AuthenticationService;
}

export default class LoginHandler implements Handler<LoginCommand> {
  public commandType: string = LOGIN_COMMAND_TYPE;

  authenticationService: AuthenticationService;

  constructor({ authenticationService }: LoginHandlerProps) {
    this.authenticationService = authenticationService;
  }

  async execute(command: LoginCommand) {
    return this.authenticationService.login(command.payload.authToken);
  }
}
