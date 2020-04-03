import { usersQuery } from './../../app/features/users/graphql/queries/users.query';
import { Resolvers, MutationAddHelloArgs } from "../types";
import { CommandBus, QueryBus } from "../../shared";
import { userQuery } from "../../app/features/users/graphql/queries/user.query";
  // QUERY_IMPORTS
  // MUTATION_IMPORTS

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
      getUser: userQuery,
  // GRAPHQL_QUERIES
      hello: () => "Hello world!!",
      getUsers: usersQuery,
      // hello2: () => ""
      getBooks: () => [{ title: "asdasd", something: "sadasd" }],
    },
    Mutation: {
  // GRAPHQL_MUTATIONS
      addHello: (parent: any, args: MutationAddHelloArgs, context: MutationContext) => {
        return {
          title: args.title,
          something: args.something,
        };
      },
    },
  };

  return resolvers;
};
