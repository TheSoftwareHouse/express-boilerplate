import express from "express";
import helmet from "helmet";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import http from "http";
import { CommandBus } from "@tshio/command-bus";
import { QueryBus } from "@tshio/query-bus";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { StatusCodes } from "http-status-codes";
import pkg from "body-parser";
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
  const typeDefs = graphQLSchema;

  const app = express();
  const httpServer = http.createServer(app);
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await apolloServer.start();

  const { json } = pkg;

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(apolloServer, {
      context: async () => ({
        commandBus,
        queryBus,
      }),
    }),
  );

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
    res.status(StatusCodes.OK).json({
      status: "ok",
      deployedCommit: appConfig.deployedCommit,
    });
  });

  const swaggerDocument = await multiFileSwagger(YAML.load("../swagger/api.yaml"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/api", router);
  app.use("*", (req, res, next) => next(new NotFoundError("Page not found")));
  app.use(errorHandler);

  return app;
}

export { createApp };
