import { MutationContext } from '../../../../../graphql/resolvers';
import { {{pascalCase name}}Command } from "../../commands/{{kebabCase name}}.command";

export const {{camelCase name}}Mutation = async (parent: any, args: any, context: MutationContext) => {
  const { result } = await context.commandBus.execute(new {{pascalCase name}}Command({}));
  return result;
}