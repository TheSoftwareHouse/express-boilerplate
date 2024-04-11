import { AwilixContainer, asFunction } from "awilix";
import { errorHandler } from "../middleware/error-handler";
import { postUserRegisterTokenHandler } from "../middleware/post-user-register-token-handler";

export async function registerMiddlewares(container: AwilixContainer) {
  container.register({
    errorHandler: asFunction(errorHandler),
    postUserRegisterTokenHandler: asFunction(postUserRegisterTokenHandler),
  });

  return container;
}
