import { AwilixContainer } from "awilix";
import * as awilix from "awilix";
import { readFileSync } from "fs";
import { resolve } from "path";
import { createResolvers } from "../graphql/resolvers";

export async function registerGraphQLDependencies(container: AwilixContainer) {
  container.register({
    graphQLSchema: awilix.asValue(readFileSync(resolve("..", "graphql", "schema.gql"), "utf8")),
    resolvers: awilix.asFunction(createResolvers),
  });

  return container;
}
