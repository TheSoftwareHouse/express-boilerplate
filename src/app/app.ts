import * as express from "express";
import * as helmet from "helmet";
import * as cors from "cors";
import * as swaggerUi from "swagger-ui-express";
import { AwilixContainer } from "awilix";
import jsdoc from "../tools/swagger";
import { NotFoundError } from "../errors/not-found.error";

function createApp({ container }: { container: AwilixContainer }) {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(jsdoc));
  app.use("/api", container.resolve("router"));

  app.use("*", (req, res, next) => next(new NotFoundError("Page not found")));
  app.use(container.resolve("errorHandler"));

  return app;
}

export { createApp };
