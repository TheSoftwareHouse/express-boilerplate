import express from "express";
import helmet from "helmet";
import cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";
import { CommandBus } from "@tshio/command-bus";
import { QueryBus } from "@tshio/query-bus";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { MiddlewareType } from "../shared/middleware-type/middleware.type";
import { NotFoundError } from "../errors/not-found.error";
import { multiFileSwagger } from "../tools/multi-file-swagger";
import { AppConfig } from "../config/app";

export interface AppDependencies {
  router: express.Router;
  errorHandler: MiddlewareType;
  graphQLSchema: string;
  commandBus: CommandBus;
  queryBus: QueryBus<any>;
  resolvers: any;
  appConfig: AppConfig;
}

async function createApp({
  router,
  errorHandler,
  graphQLSchema,
  commandBus,
  queryBus,
  resolvers,
  appConfig,
}: AppDependencies) {
  const typeDefs = gql(graphQLSchema);

  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      req,
      commandBus,
      queryBus,
    }),
  });
  await apolloServer.start();

  app.use(cors());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["'self'", "https: 'unsafe-inline'"],
        },
      },
    }),
  );

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      deployedCommit: appConfig.deployedCommit,
    });
  });

  const swaggerDocument = await multiFileSwagger(YAML.load("../swagger/api.yaml"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/api", router);

  apolloServer.applyMiddleware({ app });
  app.use("*", (req, res, next) => next(new NotFoundError("Page not found")));
  app.use(errorHandler);

  return app;
}

export { createApp };
