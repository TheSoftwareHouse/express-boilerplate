import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { QueryBus } from "../../../../shared/query-bus";
import { UsersQuery } from "../queries/users";

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
const usersAction = ({ queryBus }: UsersActionDependencies) => async (req: Request, res: Response) => {
  const queryResult = await queryBus.execute(
    new UsersQuery({
      // query props
    }),
  );
  return res.json(queryResult.result);
};

export default usersAction;
