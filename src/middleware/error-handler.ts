import { Request, Response, NextFunction } from "express";
import { CelebrateError, isCelebrateError } from "celebrate";
import { StatusCodes } from "http-status-codes";
import { Logger } from "@tshio/logger";
import { AppError } from "../errors/app.error";
import { HttpError } from "../errors/http.error";
import { Translation } from "../shared/translation/translation";
import { ErrorCode } from "../shared/constants/error-code.enum";

type ValidationError = { [key: string]: string[] };

export const celebrateToValidationError = (error: CelebrateError): ValidationError => {
  const validationErrors: ValidationError = {};

  error.details.forEach((detail) => {
    detail.details.forEach((validationError) => {
      const key = validationError.path.join(".");
      const errorType = `validation.${validationError.type}`;

      validationErrors[key] = validationErrors[key] || [];
      validationErrors[key].push(errorType);
    });
  });

  return validationErrors;
};

export const errorHandler =
  ({ logger, restrictFromProduction }: { logger: Logger; restrictFromProduction: Function }) =>
  (err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.toString());

    if (isCelebrateError(err)) {
      try {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: celebrateToValidationError(err),
        });
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: new Translation(ErrorCode.VALIDATION_PARSE),
          stack: restrictFromProduction(err.stack),
        });
      }
    }

    if (err instanceof HttpError) {
      return res.status(err.status).json({
        error: new Translation(ErrorCode.HTTP, err.message),
      });
    }

    if (err instanceof AppError) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: new Translation(ErrorCode.APP, err.message),
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: new Translation(ErrorCode.UNKNOWN),
      stack: restrictFromProduction(err.stack),
    });
  };
