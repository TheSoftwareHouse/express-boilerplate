## Architecture

### Dependency injection

We use DI container (Awilix) for decoupling. Remember to register everything you want to use in handlers inside **container.ts**.

### Feature

Every application starts with a feature. Feature is a set of functionalities bound by a single bounded context - for example invoicing.

Features are located inside ```app/features```.

### GraphQL vs REST

This boilerplate supports both - GraphQL and REST.

Both are using Commands/Queries and handlers, however the place where we execute them is different.

For REST we are using actions.

For GraphQL we are using resolvers.

Actions are stored in ```actions` directory inside coresponding feature.

Resolvers are stored in ```graphql/mutations``` and ```graphql/queries``` directories inside coresponding feature.

### Action/Resolver + Command/Query + Handler

We are not using controllers approach. Instead, each endpoint/query/mutation has its own action/resolver that executes specific Command/Query by Command Bus.

