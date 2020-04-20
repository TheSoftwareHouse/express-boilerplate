import { QueryContext } from "../../../../../graphql/resolvers";
import { {{pascalCase name}}Query } from "../../queries/{{kebabCase name}}";

export const {{camelCase name}}Query = async (parent: any, args: any, context: QueryContext) => {
  const { result } = await context.queryBus.execute(new {{pascalCase name}}Query(args));
  return result;
};