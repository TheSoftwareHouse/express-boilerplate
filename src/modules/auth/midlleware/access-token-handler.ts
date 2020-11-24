import { NextFunction, Request, Response } from "express";
import { CommandBus } from "../../../shared/command-bus";

export interface AuthMiddlewareDependencies {
  commandBus: CommandBus;
  securityClient: any;
}

export const authTokenHandlerMiddleware = (dependencies: AuthMiddlewareDependencies) => {
  const { securityClient } = dependencies;

  return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization = "" } = req.headers;

    const accessToken = authorization.replace("Bearer ", "");

    const { isAuthenticated } = await securityClient.users.isAuthenticated({ accessToken });

    if (!isAuthenticated) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    res.locals.accessToken = accessToken;

    next();
  };
};
