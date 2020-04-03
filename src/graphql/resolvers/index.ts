import { Resolvers, MutationAddHelloArgs } from "../types";
import { CommandBus, QueryBus } from "../../shared";
//

export type MutationContext = {
  commandBus: CommandBus;
};

export type QueryContext = {
  queryBus: QueryBus;
};

interface ResolversDependencies {}

export const createResolvers = (dependencies: ResolversDependencies): Resolvers => {
  // Provide resolver functions for your schema fields
  const resolvers = {
    Query: {
      // GRAPHQL_QUERIES
      hello: () => "Hello world!",
      getBooks: () => [{ title: "asdasd", something: "sadasd" }],
    },
    Mutation: {
      addHello: (parent, args: MutationAddHelloArgs, context: MutationContext) => {
        return {
          title: args.title,
          something: args.something,
        };
      },
    },
  };

  return resolvers;
};
