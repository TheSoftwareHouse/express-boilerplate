import { NextFunction, Request, Response } from "express";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "../../../../shared/command-bus";
import { Action } from "../../../../shared/http/types";

export interface AuthLoginActionDependencies {
  commandBus: CommandBus;
  securityClient: any;
}

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
          username: {
            type: "string",
            required: true,
          },
          password: {
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
  async invoke({ body }: Request, res: Response, next: NextFunction) {
    const { securityClient } = this.dependencies;
    try {
      const tokens = await securityClient.auth.login(body);
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthLoginAction;