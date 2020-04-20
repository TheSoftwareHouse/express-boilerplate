import { MutationContext } from "../../../../../graphql/resolvers";
import { {{pascalCase name}}Command } from "../../commands/{{kebabCase name}}.command";
import { Mutation{{pascalCase name}}Args } from "../../../../../graphql/types";

export const {{camelCase name}}Mutation = async (parent: any, args: Mutation{{pascalCase name}}Args, context: MutationContext) => {
  const { result } = await context.commandBus.execute(new {{pascalCase name}}Command(args));
  return result;
};