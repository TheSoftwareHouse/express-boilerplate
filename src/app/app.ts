import * as express from "express";
import helmet from "helmet";
import * as cors from "cors";
import { ApolloServer, gql } from "apollo-server-express";
import { CommandBus } from "@tshio/command-bus";
import { QueryBus } from "@tshio/query-bus";
import * as swaggerUi from "swagger-ui-express";
import * as YAML from "yamljs";
import { MiddlewareType } from "../shared/middleware-type/middleware.type";
import { NotFoundError } from "../errors/not-found.error";
import { multiFileSwagger } from "../tools/multi-file-swagger";

export interface AppDependencies {
  router: express.Router;
  errorHandler: MiddlewareType;
  graphQLSchema: string;
  commandBus: CommandBus;
  queryBus: QueryBus<any>;
  resolvers: any;
}

async function createApp({ router, errorHandler, graphQLSchema, commandBus, queryBus, resolvers }: AppDependencies) {
  const typeDefs = gql(graphQLSchema);

  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
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

  app.use(helmet.contentSecurityPolicy());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
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
