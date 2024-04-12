import { auth } from "express-oauth2-jwt-bearer";
import { AppConfig } from "../config/app";
import { Request, Response, NextFunction } from "express";

export interface validateAccessTokenDependencies {
  appConfig: AppConfig;
}

export const validateAccessToken = (dependencies: validateAccessTokenDependencies) => auth({
  issuerBaseURL: `https://${dependencies.appConfig.auth0Domain}`,
  audience: dependencies.appConfig.auth0Audience,
});

export const checkClaims =
  (dependencies: validateAccessTokenDependencies) =>
  async (req: Request, res: Response, next: NextFunction) => {

    console.log(req.auth?.header)
    console.log(req.auth?.payload)
    console.log(req.auth?.token)

    return next();
  };