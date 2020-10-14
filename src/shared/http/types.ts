import { Request, Response, NextFunction } from "express";

export interface Action {
  invoke(req: Request, res: Response, next?: NextFunction): Promise<void>;
}
