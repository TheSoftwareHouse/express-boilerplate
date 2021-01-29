import { Request, Response } from "express";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { SecurityClient } from "@tshio/security-client/dist/services/security-client";
import { CREATED, INTERNAL_SERVER_ERROR } from "http-status-codes";
import { Action } from "../../../../shared/http/types";
import { ProfileRepository } from "../repositories/profile.repostiory";
import { AuthModuleConfig } from "../../config/auth";

export interface ChangePasswordActionDependencies {
  profileRepository: ProfileRepository;
  authModuleConfig: AuthModuleConfig;
  securityClient: SecurityClient;
}

@ApiPath({
  path: "/api",
  name: "Auth",
})
class ChangePasswordAction implements Action {
  constructor(private dependencies: ChangePasswordActionDependencies) {}

  @ApiOperationPost({
    path: "/auth/change-password/{resetPasswordToken}",
    description: "Change password example",
    parameters: {
      path: {
        resetPasswordToken: {
          type: "string",
          required: true,
        },
      },
      body: {
        properties: {
          newPassword: {
            type: "string",
            required: false,
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
    const { securityClient } = this.dependencies;

    const { resetPasswordToken } = req.params;
    const { newPassword } = req.body;

    const changePasswordRequest = {
      resetPasswordToken,
      newPassword,
    };

    try {
      await securityClient.auth.resetPassword(changePasswordRequest);
      res.status(CREATED).json();
    } catch (error) {
      const statusCode = error.statusCode ?? INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({
        error: error.message,
      });
    }
  }
}

export default ChangePasswordAction;
