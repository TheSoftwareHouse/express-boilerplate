import { AwilixContainer, asFunction } from "awilix";
import { errorHandler } from "../middleware/error-handler";

export async function registerMiddlewares(container: AwilixContainer) {
  container.register({
    errorHandler: asFunction(errorHandler),
  });

  return container;
}
