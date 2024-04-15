import { JWTPayload, auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Logger } from "winston";
import { AppConfig } from "../config/app";
import { Translation } from "../shared/translation/translation";
import { ErrorCode } from "../shared/constants/error-code.enum";

interface Auth0Dependencies {
  appConfig: AppConfig;
  logger: Logger;
}

interface AuthPayloadInterface extends JWTPayload {
  me?: {
    email?: string;
  };
}

export const validateAccessToken = (dependencies: Auth0Dependencies) =>
  auth({
    issuerBaseURL: `https://${dependencies.appConfig.auth0Domain}`,
    audience: dependencies.appConfig.auth0Audience,
  });

export const checkTokenPayload =
  (dependencies: Auth0Dependencies) => async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.auth?.payload as AuthPayloadInterface;
    const email = payload?.me?.email;

    if (!email) {
      dependencies.logger.error("Authorization token is not valid");

      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: new Translation(ErrorCode.HTTP, "Authorization token is not valid"),
      });
    }

    res.locals.auth = { email }; // eslint-disable-line no-param-reassign
    return next();
  };
