import { Request } from "express";
import { CommandBus } from "../../../shared/command-bus";

export interface AuthMiddlewareDependencies {
  commandBus: CommandBus;
  securityClient: any;
}

export const authTokenHandlerMiddleware = (dependencies: AuthMiddlewareDependencies) => {
  return (req: Request, res, next) => {
    const { authorization = "" } = req.headers;
    const apiKey = req.headers["x-api-key"];

    if (apiKey) {
      res.locals.apiKey = apiKey;
      return next();
    }

    res.locals.accessToken = authorization.replace("Bearer ", "");
    return next();
  };
};
