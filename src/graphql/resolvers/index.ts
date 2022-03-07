import { CommandBus } from "@tshio/command-bus";
import { QueryBus } from "@tshio/query-bus";
import { Resolvers } from "../types";
import { usersQuery } from "../../app/features/example/graphql/queries/users.query";
// QUERY_IMPORTS
import { deleteUserMutation } from "../../app/features/example/graphql/mutations/delete-user.mutation";
// MUTATION_IMPORTS

export type MutationContext = {
  commandBus: CommandBus;
};

export type QueryContext = {
  queryBus: QueryBus<any>;
};

interface ResolversDependencies {}

export const createResolvers = (_dependencies: ResolversDependencies): Resolvers => {
  // Provide resolver functions for your schema fields
  return {
    Query: {
      getUsers: usersQuery,
      // GRAPHQL_QUERIES
    },
    Mutation: {
      deleteUser: deleteUserMutation,
      // GRAPHQL_MUTATIONS
    },
  };
};
