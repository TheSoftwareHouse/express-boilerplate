import * as express from "express";
import * as helmet from "helmet";
import * as cors from "cors";
import * as swagger from "swagger-express-ts";
import { ApolloServer, gql } from "apollo-server-express";
import { MiddlewareType } from "../shared/middleware-type/middleware.type";
import { NotFoundError } from "../errors/not-found.error";
import { CommandBus } from "../shared";
import { QueryBus } from "../shared";
import { name, version, description } from "../../package.json";

export interface AppDependencies {
  router: express.Router;
  errorHandler: MiddlewareType;
  graphQLSchema: string;
  commandBus: CommandBus;
  queryBus: QueryBus;
  resolvers: any;
}

function createApp({ router, errorHandler, graphQLSchema, commandBus, queryBus, resolvers }: AppDependencies) {
  const typeDefs = gql(graphQLSchema);

  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    tracing: true,
    context: () => ({
      commandBus,
      queryBus,
    }),
  });

  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "200 - ok",
    });
  });

  app.use("/api-docs", express.static("../swagger"));
  app.use("/api-docs/swagger/assets", express.static("../node_modules/swagger-ui-dist"));
  app.use(
    swagger.express({
      definition: {
        info: {
          title: name,
          version,
          description,
        },
      },
    }),
  );
  app.use("/api", router);

  apolloServer.applyMiddleware({ app });

  app.use("*", (req, res, next) => next(new NotFoundError("Page not found")));
  app.use(errorHandler);

  return app;
}

export { createApp };
