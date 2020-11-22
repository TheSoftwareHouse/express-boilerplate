import { Request, Response } from "express";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "../../../../shared/command-bus";
import { Action } from "../../../../shared/http/types";

export interface AuthLoginActionDependencies {
  commandBus: CommandBus;
}

export const authLoginActionValidation = celebrate(
  {
    body: Joi.object().keys({
      authToken: Joi.string().required(),
    }),
  },
  { abortEarly: false },
);

@ApiPath({
  path: "/api",
  name: "Auth",
})
class AuthLoginAction implements Action {
  constructor(private dependencies: AuthLoginActionDependencies) {}

  @ApiOperationPost({
    path: "/auth/login",
    description: "Login example",
    parameters: {
      body: {
        properties: {
          authToken: {
            type: "string",
            required: true,
          },
        },
      },
    },
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
  async invoke({ body }: Request, res: Response) {
    res.json(body);
  }
}

export default AuthLoginAction;
