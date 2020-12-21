import { NextFunction, Request, Response } from "express";
import { SecurityClient } from "@tshio/security-client/dist/services/security-client";
import jwtDecode from "jwt-decode";

export interface AuthMiddlewareDependencies {
  securityClient: SecurityClient;
}

export const authTokenHandlerMiddleware = (dependencies: AuthMiddlewareDependencies) => {
  const { securityClient } = dependencies;
  return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization = "" } = req.headers;

    const accessToken = authorization.replace("Bearer ", "");

    try {
      const { isAuthenticated } = await securityClient.users.isAuthenticated({ accessToken });

      if (!isAuthenticated) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      const tokenInfo = jwtDecode(accessToken);

      // eslint-disable-next-line
      res.locals.accessToken = accessToken;
      // eslint-disable-next-line
      res.locals.tokenInfo = tokenInfo;

      return next();
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  };
};
