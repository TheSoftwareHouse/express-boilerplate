import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { QueryBus } from "@tshio/query-bus";
import { MeQuery } from "../queries/me";
import { Action } from "../../../../shared/http/types";

export interface MeActionDependencies {
  queryBus: QueryBus<any>;
}

export const meActionValidation = celebrate(
  {
    headers: Joi.object(),
  },
  { abortEarly: false },
);

class MeAction implements Action {
  constructor(private dependencies: MeActionDependencies) {}

  async invoke(req: Request, res: Response) {
    const queryResult = await this.dependencies.queryBus.execute(
      new MeQuery({
        email: res.locals.auth.email,
      }),
    );

    res.json(queryResult.result);
  }
}
export default MeAction;
