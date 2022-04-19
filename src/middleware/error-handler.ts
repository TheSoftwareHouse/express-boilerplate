import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";
import { StatusCodes } from "http-status-codes";
import { Logger } from "@tshio/logger";
import { AppError } from "../errors/app.error";
import { HttpError } from "../errors/http.error";
import { Translation } from "../shared/translation/translation";

export const celebrateToValidationError = (segments: any): { [key: string]: Translation } => {
  const segmentsArray: any = [];
  segments.details.forEach((errors: { details: { path: string[]; type: string }[] }, key: string) => {
    const errorsArray: any = errors.details.map((error) => {
      const path = error.path.join(".");
      const translationId = `validation.${error.type}`;

      return {
        [path]: new Translation(translationId),
      };
    });
    segmentsArray.push({
      [key]: Object.assign.apply({}, errorsArray),
    });
  });
  return Object.assign.apply({}, segmentsArray);
};

export const errorHandler =
  ({ logger, restrictFromProduction }: { logger: Logger; restrictFromProduction: Function }) =>
  (err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error(err.toString());

    if (isCelebrateError(err)) {
      try {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: celebrateToValidationError(err),
          stack: restrictFromProduction(err.stack),
        });
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: new Translation("error.validation.parse"),
          stack: restrictFromProduction(err.stack),
        });
      }
    }

    if (err instanceof HttpError) {
      return res.status(err.status).json({
        error: new Translation(err.message),
        stack: restrictFromProduction(err.stack),
      });
    }

    if (err instanceof AppError) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: new Translation(err.message),
        stack: restrictFromProduction(err.stack),
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: new Translation("error.unknown"),
      stack: restrictFromProduction(err.stack),
    });
  };
