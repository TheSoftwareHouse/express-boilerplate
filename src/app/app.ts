import * as express from "express";
import * as helmet from "helmet";
import * as cors from "cors";
import * as swaggerUi from "swagger-ui-express";
import { ApolloServer, gql } from "apollo-server-express";
import jsdoc from "../tools/swagger";
import { MiddlewareType } from "../shared/middleware-type/middleware.type";
import { NotFoundError } from "../errors/not-found.error";
import { CommandBus } from "../shared";
import { QueryBus } from "../shared";

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

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(jsdoc));
  app.get("/api-docs.json", (req, res) => res.json(jsdoc));
  app.use("/api", router);

  apolloServer.applyMiddleware({ app });

  app.use("*", (req, res, next) => next(new NotFoundError("Page not found")));
  app.use(errorHandler);

  return app;
}

export { createApp };
