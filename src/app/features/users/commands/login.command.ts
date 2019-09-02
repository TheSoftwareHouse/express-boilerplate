import { Command } from "../../../../shared/command-bus";

export const LOGIN_COMMAND_TYPE = "users/LOGIN";

export interface LoginCommandPayload {
  authToken: string;
}

export class LoginCommand implements Command<LoginCommandPayload> {
  public type: string = LOGIN_COMMAND_TYPE;

  constructor(public payload: LoginCommandPayload) {}
}
