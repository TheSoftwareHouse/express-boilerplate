import { Request, Response } from "express";
import { ApiOperationGet, ApiPath } from "swagger-express-ts";
import { celebrate, Joi } from "celebrate";
import { QueryBus } from "@tshio/query-bus";
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

@ApiPath({
  path: "/api",
  name: "Users",
})
class UsersAction implements Action {
  constructor(private dependencies: UsersActionDependencies) {}

  @ApiOperationGet({
    path: "/example/example",
    description: "Login example",
    responses: {
      200: {
        description: "Success",
      },
      400: {
        description: "Validation error",
      },
      500: {
        description: "Internal Server Error",
      },
    },
  })
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
