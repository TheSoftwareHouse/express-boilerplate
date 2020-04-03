import { QueryContext } from "../../../../../graphql/resolvers";
import { UsersQuery } from "../../queries/users";

export const usersQuery = async (parent: any, args: any, context: QueryContext) => {
  const { result } = await context.queryBus.execute(new UsersQuery(args));
  return result;
};
