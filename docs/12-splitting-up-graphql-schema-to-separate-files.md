## Splitting up the GraphQL schema to separate files

### Adjust configuration

To be able to split up the graphql schema to separate files, we need to adjust the app configuration to allow using graphql imports. 
The changes should be made for both `codegen` and the dependency injection container (`awilix`).

#### Codegen changes

By default, `codegen` doesn't parse GraphQL imports and treats them as usual comments. 

To change the default behavior, we need to set `skipGraphQLImport` to `false` for our entry file:

```yaml
# ./codegen.yml

schema:
  - ./graphql/schema.gql:
      skipGraphQLImport: false
 ```

Then using `npm run generate-schema` command should work like before making the changes.

#### Awilix changes

In `awilix` we are importing the graphql schema using `path.resolve`:

```javascript
// src/container/graphql.ts

export async function registerGraphQLDependencies(container: AwilixContainer) {
  container.register({
    graphQLSchema: asValue(readFileSync(resolve("..", "graphql", "schema.gql"), "utf8")),
    resolvers: asFunction(createResolvers),
  });

  return container;
}
```

The code above won't work anymore since the graphql imports will be ignored. To change that, we need to use packages coming from the `graphql-tools`:

```bash
$ npm install @graphql-tools/load @graphql-tools/graphql-file-loader @graphql-tools/schema
```

Then we can adjust the configuration. It's recommended to change the key `graphQLSchema` to `typeDefs` to follow the naming convention.

```javascript
// src/container/graphql.ts
 
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

// (...)

export async function registerGraphQLDependencies(container: AwilixContainer) {
  container.register({
    typeDefs: asValue(loadSchemaSync(resolve("..", "graphql", "schema.gql"), { loaders: [new GraphQLFileLoader()] })),
    resolvers: asFunction(createResolvers),
  });

  return container;
}
```

This will require us to make some additional changes in the `createApp` function too:

```javascript
// src/app.ts

import { makeExecutableSchema } from "@graphql-tools/schema";

// (...)

async function createApp({ 
  router, 
  errorHandler, 
  // - graphQLSchema
  typeDefs,
  commandBus, 
  queryBus, 
  resolvers 
}: AppDependencies) {
  const app = express();
  const apolloServer = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    // - typeDefs,
    // - resolvers,
    context: () => ({
      commandBus,
      queryBus,
    }),
  });
  
  // (...)
}
```

### Using GraphQL imports

From now on, we can use graphql imports within our `.graphql` files to split the schema to separate files.

That's the default schema for this boilerplate:

```graphql
# schema.gql

type User {
  firstName: String
  lastName: String
}

type Query {
  getUsers: [User]
  getUser: User
}

type Mutation {
  deleteUser(id: String): String
}
```

E.g., we can separate the User entity while keeping queries and mutations within the main schema file.

```graphql
# user.gql

type User {
  firstName: String
  lastName: String
}
```

```graphql
# schema.gql

# import * from './user.gql'

type Query {
  getUsers: [User]
  getUser: User
}

type Mutation {
  deleteUser(id: String): String
}
```

Please notice that even though it looks like a comment the hash (`#`) is required since it's a graphql import syntax.

In some situations, importing only a specific type may be needed. You can do it like this:

```graphql
# import Foo, Bar from './foobar.gql'
```

**In the end, remember that you have to import all of your files with the entry file (in our case `schema.gql`). Otherwise, it won't work.**