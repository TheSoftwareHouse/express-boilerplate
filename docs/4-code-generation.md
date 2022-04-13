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

- crud rest api - creates REST API methods (create, update, delete, details, list) based on given feature & model name


Using `crud rest api` generator:

- first of all you must create feature with whole structure (you may use plop `feature` command for this), it would be the best that feature names are in plural (e.g. profiles),
- you must have some model(s) (with proper migrations for them) created in feature, 
- it would be the best that the models are not yet attached to the containers and their names are in singular (e.g. profile),
- after generator has been successfully runned you should be able to see new working methods in swagger, 
- now you may add some bussines logic, validation, custom repositories, tests etc.

CRUD REST API generator schema example:
- GET /profiles - list profiles
- GET /profiles/:id - get profile details
- POST /profiles - create profile
- PATCH /profiles/:id - update profile
- DELETE /profiles/:id - delete profile

CRUD typeorm path mapper builder example:

```
http://localhost:1337/api/profiles?                 // Get profiles list
relations[]=profile.projects&                       // with related projects, 
relations[]=profileProjects.project&                // with related projects details
filter[profileProjectsProject.name][include]=test&  // filter by project details name (LIKE % %)
sort[profile.firstName]=ASC&                        // order by profile firstName ASC
page=1&                                             // paginate on page 1 
limit=10                                            // limit 10 rows
```
