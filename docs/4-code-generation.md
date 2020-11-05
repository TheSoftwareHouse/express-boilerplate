## Code generation

We are using **plop** for code generation.

Just run ```npm run plop```, select generator and follow steps.

**Every generated code is automaticaly registered in Dependency Injection container.**

As for now we support multiple generators:

- action+command+handler - creates REST API action, coresponding command and command handler for it

- action+query+handler - creates REST API action, coresponding query and query handler for it

- graphql+query+handler - creates GraphQL query, coresponding query and query handler for it
  
- graphql+command+handler - creates GraphQL mutation, coresponding command and command handler for it

- model - creates TypeORM model
  
- feature - creates feature and all of its directories in features directory

- action - create an REST API action

- command - creates a command object

- command handler - creates a command handler

- query - creates a query and query result objects

- query handler - creates query handler

- query with handler - creates query and query handler 

- event subscriber - creates event subscriber

- graphql-query - creates GraphQL query

- graphql-mutation - creates GraphQL mutation