import { getSecurityClient, HttpErrors } from "@tshio/security-client";
import { SecurityClient } from "@tshio/security-client/dist/services/security-client";
import { Request, Response, NextFunction, Router, RouterOptions } from "express";

class Security {
  constructor(private securityConfig: any) {
    this.securityClient = getSecurityClient(securityConfig);
  }

  private securityClient: SecurityClient;
  private router: Router;

  isAuthorizedMiddleware(resources: string[]) {
    const self = this;

    return async function (req: Request, _res: Response, next: NextFunction) {
      // TODO!
      // const { [appConfig.apiKeyHeaderName]: apiKey = "" } = req.headers;
      // const { apiKey, authorization: accessToken } = req.headers;

      try {
        const { authorization } = req.headers;
        const accessToken = authorization ? (authorization as string).replace("Bearer ", "") : undefined;
        const result: any = await self.securityClient.users.hasAccess({ resources }, { accessToken });

        if (!result.hasAccess) {
          throw new HttpErrors.Forbidden();
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  }

  getRouter(options?: RouterOptions) {
    const router = Router(options);
  }
}
