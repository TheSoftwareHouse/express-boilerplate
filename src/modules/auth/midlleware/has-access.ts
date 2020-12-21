import { NextFunction, Request, Response } from "express";

export interface HasAccessMiddlewareDependencies {
  securityClient: any;
}

export const hasAccessMiddleware = (dependencies: HasAccessMiddlewareDependencies) => {
  const { securityClient } = dependencies;

  return (resources: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken = "" } = res.locals;

    try {
      const { hasAccess } = await securityClient.users.hasAccess({ resources }, { accessToken });

      if (!hasAccess) {
        return res.status(403).json({
          error: "Forbidden",
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  };
};
