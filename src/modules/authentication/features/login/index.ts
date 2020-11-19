import { Request, Response, NextFunction, Router, RouterOptions } from "express";
import { SecurityClient } from "@tshio/security-client/dist/services/security-client";

export const createLoginRequestHandler = (securityClient: SecurityClient) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = await securityClient.auth.login({ ...(req.body ?? {}) });

  return res.json(body);
};

export function getLoginRoute(securityClient: SecurityClient, options?: RouterOptions) {
  const router = Router(options);

  const loginRequestHandler = createLoginRequestHandler(securityClient);

  router.post("/login", loginRequestHandler);

  return router;
}
