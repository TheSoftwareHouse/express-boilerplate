import { AwilixContainer } from "awilix";
import * as awilix from "awilix";
import { errorHandler } from "../middleware/error-handler";

export async function registerMiddlewares(container: AwilixContainer) {
  container.register({
    errorHandler: awilix.asFunction(errorHandler),
  });

  return container;
}
