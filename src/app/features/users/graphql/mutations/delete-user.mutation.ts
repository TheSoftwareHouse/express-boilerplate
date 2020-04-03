import { MutationContext } from "../../../../../graphql/resolvers";
import { DeleteUserCommand } from "../../commands/delete-user.command";
import { MutationDeleteUserArgs } from "../../../../../graphql/types";

export const deleteUserMutation = async (parent: any, args: MutationDeleteUserArgs, context: MutationContext) => {
  const { result } = await context.commandBus.execute(new DeleteUserCommand(args));
  return result;
};
