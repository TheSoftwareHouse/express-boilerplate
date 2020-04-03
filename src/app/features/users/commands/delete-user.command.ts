import { Command } from "../../../../shared/command-bus";

export const DELETE_USER_COMMAND_TYPE = "users/DELETE_USER";

export interface DeleteUserCommandPayload {
  id?: string | null | undefined;
}

export class DeleteUserCommand implements Command<DeleteUserCommandPayload> {
  public type: string = DELETE_USER_COMMAND_TYPE;

  constructor(public payload: DeleteUserCommandPayload) {}
}
