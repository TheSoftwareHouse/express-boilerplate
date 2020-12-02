import { NextFunction, Request, Response } from "express";
import { SecurityClient } from "@tshio/security-client";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { CommandBus } from "../../../../shared/command-bus";
import { Action } from "../../../../shared/http/types";

export interface GoogleLoginActionDependencies {
  commandBus: CommandBus;
  securityClient: SecurityClient;
}

@ApiPath({
  path: "/api",
  name: "Auth",
})
class GoogleLoginAction implements Action {
  constructor(private dependencies: GoogleLoginActionDependencies) {}

  @ApiOperationPost({
    path: "/auth/login/google",
    description: "Google login example",
    parameters: {
      body: {
        properties: {
          code: {
            type: "string",
            required: true,
          },
          redirectUrl: {
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
      const tokens = await securityClient.auth.googleLogin(body);
      res.json(tokens);
    } catch (error) {
      next(error);
    }
  }
}

export default GoogleLoginAction;
