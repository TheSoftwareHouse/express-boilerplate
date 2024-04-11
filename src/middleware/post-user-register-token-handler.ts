import { Request, Response, NextFunction } from "express";
import { Logger } from "@tshio/logger";
import { StatusCodes } from "http-status-codes";
import { AppConfig } from "../config/app";
import { Translation } from "../shared/translation/translation";
import { ErrorCode } from "../shared/constants/error-code.enum";

interface PostUserRegisterTokenHandlerDependencies {
  appConfig: AppConfig;
  logger: Logger;
}

export const postUserRegisterTokenHandler =
  (dependencies: PostUserRegisterTokenHandlerDependencies) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["x-auth-token"];

    if (!token) {
      dependencies.logger.error("Token not found in headers");
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: new Translation(ErrorCode.HTTP, "Token not found in headers"),
      });
    }

    if (token !== dependencies.appConfig.postUserRegisterToken) {
      dependencies.logger.error("Wrong authorization token");
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: new Translation(ErrorCode.HTTP, "Wrong authorization token"),
      });
    }

    return next();
  };
