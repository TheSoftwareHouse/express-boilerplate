### Introduction

Example implementation of Auth0 in a project. Contains 2 example methods: 
  - POST `/api/example/post-user-registration`: triggered after user registration in Auth0. Method requires header: `x-auth-token`, defined in environment variables. 
  - GET `/api/example/me`: method that returns basic user data. Requires Authorization header (Bearer token received from Auth0 after logging in). 

##

### Implementation

1. Auth0 set up.

    1. Log into Auth0 dashboard.
    2. Navigate in sidebar to `Applications -> APIs`. Press `Create API` button. Insert API name, identifier and confirm. Along with the API, an Application was created (`Applications -> Applications`).
    3. Navigate to `Authentication -> Database` and press the `Create Database` button. Insert Database name and confirm. After confirmation, move in the navigation bar to `Applications` tab and toggle the switch next to created Application to connect Database with it. 
    4. Navigate to `Applications -> Applications` and enter Application settings. Move to the bottom of the page to `Advenced Settings`. Move to `Grant Types` tab and check the `Password` checkbox. Save changes. 
    5. Navigate to `Settings` in sidebar and find `API Authorization Settings`. In `Default Directory` enter Database name to set is as default connection. Save changes. 

2. Add Auth0 environment variables to express app:
    - Example token to validate `post-user-registration` method,
    - Domain can be found under `Applications -> Applications -> your application settings -> Basic Information -> Domain`,
    - Audience can be found under `Applications -> APIs -> you API settings -> General Settings -> Identifier`.

    ```
    POST_USER_REGISTER_TOKEN=exampleToken
    AUTH0_DOMAIN=
    AUTH0_AUDIENCE=
    ```

3. Set up Auth0 Actions. 

    1. Navigate in sidebar to `Actions -> Library`, press `Create Action` button and choose `Build from scratch` in the drop-down menu. Enter `Post User      Registration` action name and choose trigger `Post User Registration`. Press `Create` and a window with the handler will be shown.
    2. Copy code from `./auth0-actions/post-user-registration-action.ts` and paste it into action handler.
    3. On the left side of the handler window, move to the `Dependencies` tab and press `Add Dependency`. Enter `axios` in the name input and press `Create`. 
    4. On the left side of the handler window, move to the `Secrets` tab and press `Add Secret`. Enter `POST_USER_REGISTRATION_URL` in the name input and in Value input insert Url to POST `/api/example/post-user-registration` (this action will work only after the deployment of your application). Press `Create`. Press again `Add Secret` and add `X_AUTH_TOKEN` secret with Value of the `POST_USER_REGISTER_TOKEN` environment variable in application.
    5. Press `Save Draft` button in upper right corner. Press `Deploy` button.
    6. Repat steps i, ii and v and create Post Login Action choosing `Login/Post Login` as Trigger and copy the handler code from `./auth0-actions/post-user-registration-action.ts`.
    7. Navigate in the sidebar to `Actions -> Flows` and choose Login Flow. In the Add Action window on the right side, choose `Custom` tab, then Drag you `Post Login Action` and drop in between `Start` and `Complete` steps. Press `Apply` button in upper right corner to apply changes.
    8. Repeat step vii and add to the Post User Registration flow your `Post User Registration` action.

    `Post User Registration` action will create a POST request to express app and will pass registered user's id in request body. `Post Login Action` will add user's email as custom claim inside Access Token.

4. Install necessary packages: 
    ```
    npm install sinon --save-dev
    npm i --save-dev @types/sinon
    npm install supertest --save-dev
    npm install express-oauth2-jwt-bearer
    ```

5. Copy necessary files.
    ```
    cp -r ./toolkit/auth0/actions/* ./src/app/features/example/actions/
    cp -r ./toolkit/auth0/commands/* ./src/app/features/example/commands/
    cp -r ./toolkit/auth0/handlers/* ./src/app/features/example/handlers/
    cp -r ./toolkit/auth0/queries/* ./src/app/features/example/queries/
    cp -r ./toolkit/auth0/query-handlers/* ./src/app/features/example/query-handlers/
    cp -r ./toolkit/auth0/middleware/* ./src/middleware/
    cp -r ./toolkit/auth0/tests/shared/* ./src/tests/shared/
    ```

6. Copy necessary code:

    All modified files can be found at `./toolkit/auth0`.

    - Copy to `src/app/features/example/routing.ts`
      ```
      
      import { postUserRegistrationActionValidation } from "./actions/post-user-registration.action";
      import { MiddlewareType } from "../../../shared/middleware-type/middleware.type";
      import { meActionValidation } from "./actions/me.action";

      export interface UsersRoutingDependencies {
        ...

        postUserRegistrationAction: Action;
        postUserRegisterTokenHandler: MiddlewareType;
        checkTokenPayload: MiddlewareType;
        validateAccessToken: MiddlewareType;
        meAction: Action;

        ...
        // ACTIONS_IMPORTS
      }

      export const usersRouting = (actions: UsersRoutingDependencies) => {
        ...

        router.post(
          "/post-user-registration",
          [actions.postUserRegisterTokenHandler, postUserRegistrationActionValidation],
          actions.postUserRegistrationAction.invoke.bind(actions.postUserRegistrationAction),
        );
        router.get(
          "/me",
          [actions.validateAccessToken, actions.checkTokenPayload, meActionValidation],
          actions.meAction.invoke.bind(actions.meAction),
        );

        ...
      }
      ```

    - Copy to `src/config/app.ts`
      ```
      export interface AppConfig {
        ...

        postUserRegisterToken: string;
        auth0Domain: string;
        auth0Audience: string;

        ...
      }

      const loadConfig = (env: any): AppConfig => ({
        ...

        postUserRegisterToken: env.POST_USER_REGISTER_TOKEN,
        auth0Domain: env.AUTH0_DOMAIN,
        auth0Audience: env.AUTH0_AUDIENCE,

        ...
      });

      const validateConfig = (config: AppConfig) => {
        const schema = Joi.object<AppConfig>().keys({
          ...

          postUserRegisterToken: Joi.string().required(),
          auth0Domain: Joi.string().required(),
          auth0Audience: Joi.string().required(),

          ...
        });
      };
      ```

    - Copy to `src/container/command-handlers.ts`
      ```
      import PostUserRegistrationCommandHandler from "../app/features/example/handlers/post-user-registration.handler";

      export async function registerCommandHandlers(container: AwilixContainer) {
        container.register({
          commandHandlers: asArray<any>([
            ...

            asClass(PostUserRegistrationCommandHandler),

            ...
          ]),
        });
      }
      ```

    - Copy to `src/container/middlewares.ts`
      ```
      import { postUserRegisterTokenHandler } from "../middleware/post-user-register-token-handler";
      import { checkTokenPayload, validateAccessToken } from "../middleware/auth0";

      export async function registerMiddlewares(container: AwilixContainer) {
        container.register({
          ...

          postUserRegisterTokenHandler: asFunction(postUserRegisterTokenHandler),
          checkTokenPayload: asFunction(checkTokenPayload),
          validateAccessToken: asFunction(validateAccessToken),

          ...
        });
      }
      ```

    - Copy to `src/container/query-handlers.ts`
      ```
      import MeQueryHandler from "../app/features/example/query-handlers/me.query.handler";

      export async function registerQueryHandlers(container: AwilixContainer) {
        container.register({
          queryHandlers: asArray<any>([
            ...

            asClass(MeQueryHandler),

            ...
          ]),
        });
      }
      ```

    - Copy to `src/middleware/error-handler.ts`
      ```
      import { InvalidTokenError, UnauthorizedError } from "express-oauth2-jwt-bearer";

      export const errorHandler =
        ({ logger, restrictFromProduction }: { logger: Logger; restrictFromProduction: Function }) =>
        (err: Error, req: Request, res: Response, _next: NextFunction) => {
          ...

          if (err instanceof InvalidTokenError) {
            const message = "Bad credentials";

            return res.status(StatusCodes.UNAUTHORIZED).json({
              error: new Translation(ErrorCode.HTTP, message),
            });
          }

          if (err instanceof UnauthorizedError) {
            const message = "Requires authentication";

            return res.status(StatusCodes.UNAUTHORIZED).json({
              error: new Translation(ErrorCode.HTTP, message),
            });
          }

          ...
      }
      ```

    - Copy to `src/tests/bootstrap.ts.ts` (important: part of the code with stubbing `validataAccessToken` middleware has to be pasted before `global.container = await createContainer();`)
      ```
      import sinon from "sinon";
      import * as auth0Module from "../middleware/auth0";

      const clearDb = async (dataSource: DataSource) => {
        const entities = dataSource.entityMetadatas;

        await dataSource.manager.transaction(async (transactionalEntityManager) => {
          // disable checking relations
          await transactionalEntityManager.query("SET session_replication_role = replica;");

          await Promise.all(entities.map((entity) => transactionalEntityManager.query(`DELETE FROM "${entity.tableName}"`)));

          // enable checking relations
          await transactionalEntityManager.query("SET session_replication_role = origin;");
        });
      };

      before(async () => {
        ...

        sinon.stub(auth0Module, "validateAccessToken").callsFake(() => (req, res, next) => {
          // eslint-disable-next-line no-param-reassign
          req.auth = {
            payload: {
              me: {
                email: "test@integration.com",
              },
            },
            header: {},
            token: "",
          };

          return next();
        });

        global.container = await createContainer();
      });

      ...
      ```

7. Register and login user.

    When all files and necessary code have been copied, build and start express app locally. When it's done, it's possible register and log in. It can be done by requesting the Auth0 API with Postman, Insomnia etc.: 

    Register user: 
      ```
      curl --location 'https://{Auth0Domain}/dbconnections/signup' \
      --header 'Content-Type: application/json' \
      --data '{
          "client_id": "",
          "email": "Enter your email",
          "password": "someRandomPassword1!",
          "connection": "Name of you Database in Auth0"
      }'
      ```

    In URL replace `Auth0Domain` with Application Domain (`AUTH0_DOMAIN` in `.env` file);
    In body enter `client_id` from: `Applications -> Applications -> settings of your application -> Basic Information -> Client ID`.

    Login user:
      ```
      curl --location 'https://{Auth0Domain}/oauth/token' \
      --header 'Content-Type: application/json' \
      --data '{
          "grant_type": "password",
          "client_id": "",
          "username": "Enter your email",
          "password": "someRandomPassword1!",
          "audience": "",
          "client_secret" : ""
      }'
      ```

    `client_secret` can be found in: `Applications -> Applications -> settings of your application -> Basic Information -> Client Secret`.
    Fill `audience` property with `AUTH0_AUDIENCE` from the `.env` file.

    In response body of this request, all the necessary data about our token can be found. They are necessary to make a request to the GET `/api/example/me` method.

8. Check functionality of example methods.

    Run GET `/api/example/me` method. 
      ```
      curl --location 'http://localhost:1337/api/example/me' \
      --header 'Authorization: Bearer {access_token}'
      ```

    In `Authorization` header enter `access_token` received in response from Login request.

    An error saying that a user like this does not exist will appear. Add a user with the same email as in Auth0 to local database. After that, method will return all user's data.

    Without `Authorization` header or with wrong one, an Unauthorized error will be returned.

    Check also `Post User Registration` method by requesting:
      ```
      curl --location 'http://localhost:1337/api/example/post-user-registration' \
      --header 'x-auth-token: exampleToken' \
      --header 'Content-Type: application/json' \
      --data '{
          "userId": "someUserId"
      }'
      ```
##