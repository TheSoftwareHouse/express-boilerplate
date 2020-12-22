import { Request, Response, NextFunction } from "express";
import { isCelebrate } from "celebrate";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status-codes";
import { Logger } from "@tshio/logger";
import { AppError } from "../errors/app.error";
import { HttpError } from "../errors/http.error";
import { Translation } from "../shared/translation/translation";

export const celebrateToValidationError = (errors: any): { [key: string]: Translation } => {
  const errorsArray: any = errors.joi.details.map((error: { path: string[]; type: string }) => {
    const key = error.path.join(".");
    const translationId = `validation.${error.type}`;

    return {
      [key]: new Translation(translationId),
    };
  });

  return Object.assign.apply({}, errorsArray);
};

export const errorHandler = ({
  logger,
  restrictFromProduction,
}: {
  logger: Logger;
  restrictFromProduction: Function;
}) => <T>(err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.toString());

  if (isCelebrate(err)) {
    try {
      return res.status(BAD_REQUEST).json({
        error: celebrateToValidationError(err),
        stack: restrictFromProduction(err.stack),
      });
    } catch (e) {
      return res.status(INTERNAL_SERVER_ERROR).json({
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
    return res.status(INTERNAL_SERVER_ERROR).json({
      error: new Translation(err.message),
      stack: restrictFromProduction(err.stack),
    });
  }

  return res.status(INTERNAL_SERVER_ERROR).json({
    error: new Translation("error.unknown"),
    stack: restrictFromProduction(err.stack),
  });
};
