import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { QueryBus } from "../../../../shared/query-bus";
import { UsersQuery } from "../queries/users";
import { Action } from "../../../../shared/http/types";

export interface UsersActionDependencies {
  queryBus: QueryBus;
}

export const usersActionValidation = celebrate(
  {
    headers: Joi.object(),
  },
  { abortEarly: false },
);

/**
 * @swagger
 *
 * /api/users/users:
 *   get:
 *     description: desc
 *     responses:
 *       201:
 *         description: desc
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
class UsersAction implements Action {
  constructor(private dependencies: UsersActionDependencies) {}

  async invoke(req: Request, res: Response) {
    const queryResult = await this.dependencies.queryBus.execute(
      new UsersQuery({
        // query props
      }),
    );

    res.json(queryResult.result);
  }
}

export default UsersAction;
