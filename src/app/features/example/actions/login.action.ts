import { Request, Response } from "express";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "@tshio/command-bus";
import { LoginCommand } from "../commands/login.command";
import { Action } from "../../../../shared/http/types";

export interface LoginActionDependencies {
  commandBus: CommandBus;
}

export const loginActionValidation = celebrate(
  {
    body: Joi.object().keys({
      authToken: Joi.string().required(),
    }),
  },
  { abortEarly: false },
);

@ApiPath({
  path: "/api",
  name: "Users",
})
class LoginAction implements Action {
  constructor(private dependencies: LoginActionDependencies) {}

  @ApiOperationPost({
    path: "/example/login",
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
    const result = await this.dependencies.commandBus.execute(
      new LoginCommand({
        authToken: body.authToken,
      }),
    );

    res.json(result);
  }
}

export default LoginAction;
