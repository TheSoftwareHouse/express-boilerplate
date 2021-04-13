import { AwilixContainer, asValue, asFunction } from "awilix";
import { readFileSync } from "fs";
import { resolve } from "path";
import { createResolvers } from "../graphql/resolvers";

export async function registerGraphQLDependencies(container: AwilixContainer) {
  container.register({
    graphQLSchema: asValue(readFileSync(resolve("..", "graphql", "schema.gql"), "utf8")),
    resolvers: asFunction(createResolvers),
  });

  return container;
}
