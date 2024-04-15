import { AwilixContainer, asFunction } from "awilix";
import { errorHandler } from "../middleware/error-handler";
import { postUserRegisterTokenHandler } from "../middleware/post-user-register-token-handler";
import { checkTokenPayload, validateAccessToken } from "../middleware/auth0";

export async function registerMiddlewares(container: AwilixContainer) {
  container.register({
    errorHandler: asFunction(errorHandler),
    postUserRegisterTokenHandler: asFunction(postUserRegisterTokenHandler),
    checkTokenPayload: asFunction(checkTokenPayload),
    validateAccessToken: asFunction(validateAccessToken),
  });

  return container;
}
