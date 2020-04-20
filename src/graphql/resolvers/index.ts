import { Resolvers } from "../types";
import { CommandBus, QueryBus } from "../../shared";
import { usersQuery } from "../../app/features/users/graphql/queries/users.query";
// QUERY_IMPORTS
import { deleteUserMutation } from "../../app/features/users/graphql/mutations/delete-user.mutation";
// MUTATION_IMPORTS

export type MutationContext = {
  commandBus: CommandBus;
};

export type QueryContext = {
  queryBus: QueryBus;
};

interface ResolversDependencies {}

export const createResolvers = (_dependencies: ResolversDependencies): Resolvers => {
  // Provide resolver functions for your schema fields
  const resolvers = {
    Query: {
      getUsers: usersQuery,
      // GRAPHQL_QUERIES
    },
    Mutation: {
      deleteUser: deleteUserMutation,
      // GRAPHQL_MUTATIONS
    },
  };

  return resolvers;
};
