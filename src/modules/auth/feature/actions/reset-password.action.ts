import { Request, Response } from "express";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { SecurityClient } from "@tshio/security-client/dist/services/security-client";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR } from "http-status-codes";
import { Action } from "../../../../shared/http/types";
import { AuthModuleConfig } from "../../config/auth";

export interface ResetPasswordActionDependencies {
  authModuleConfig: AuthModuleConfig;
  securityClient: SecurityClient;
}

@ApiPath({
  path: "/api",
  name: "Auth",
})
class ResetPasswordAction implements Action {
  constructor(private dependencies: ResetPasswordActionDependencies) {}

  @ApiOperationPost({
    path: "/auth/reset-password",
    description: "Reset password example",
    parameters: {
      body: {
        properties: {
          username: {
            type: "string",
            required: true,
          },
        },
      },
    },
    responses: {
      201: {
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
    const { securityClient, authModuleConfig } = this.dependencies;

    const { username } = req.body;

    const resetPasswordRequest = {
      username,
    };

    try {
      // eslint-disable-next-line
      const { resetPasswordToken } = await securityClient.users.passwordResetToken(resetPasswordRequest, {
        apiKey: authModuleConfig.apiKey,
      });

      // TODO! send the URL address contains resetPasswordToken to the user email

      res.status(CREATED).json();
    } catch (error) {
      if (!error.statusCode) {
        res.status(INTERNAL_SERVER_ERROR).json({
          error: error.message,
        });
        return;
      }
      if (error.statusCode === BAD_REQUEST) {
        res.status(BAD_REQUEST).json({
          error: error.message,
        });
        return;
      }
      res.status(CREATED).json();
    }
  }
}

export default ResetPasswordAction;
