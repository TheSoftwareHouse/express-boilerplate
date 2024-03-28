import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { QueryBus } from "@tshio/query-bus";
import { UsersQuery } from "../queries/users";
import { Action } from "../../../../shared/http/types";

export interface UsersActionDependencies {
  queryBus: QueryBus<any>;
}

export const usersActionValidation = celebrate(
  {
    headers: Joi.object(),
    query: Joi.object().keys({
      page: Joi.string().optional(),
      limit: Joi.string().optional(),
      sort: Joi.object().optional(),
      filter: Joi.object().optional(),
      search: Joi.string().optional(),
    }),
  },
  { abortEarly: false },
);

class UsersAction implements Action {
  constructor(private dependencies: UsersActionDependencies) {}

  async invoke({ query }: Request, res: Response) {
    const queryResult = await this.dependencies.queryBus.execute(
      new UsersQuery({
        ...query,
        page: Number(query.page),
        limit: Number(query.limit),
      }),
    );

    res.json(queryResult.result);
  }
}

export default UsersAction;
