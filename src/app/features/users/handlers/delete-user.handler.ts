import { CommandHandler } from "../../../../shared/command-bus";
import { DELETE_USER_COMMAND_TYPE, DeleteUserCommand } from "../commands/delete-user.command";

export default class DeleteUserHandler implements CommandHandler<DeleteUserCommand> {
  public commandType: string = DELETE_USER_COMMAND_TYPE;

  async execute(command: DeleteUserCommand) {
    return {
      result: `Deleted user with id ${command.payload.id}`,
    };
  }
}
