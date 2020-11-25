import { Request, Response } from "express";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { SecurityClient } from "@tshio/security-client/dist/services/security-client";
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
    path: "/auth/change-password",
    description: "Change password example",
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
    const { securityClient } = this.dependencies;

    const { resetPasswordToken, newPassword } = req.body;

    const resetPasswordRequest = {
      resetPasswordToken,
      newPassword,
    };

    try {
      const result = await securityClient.auth.resetPassword(resetPasswordRequest);
      res.status(201).json();
    } catch (error) {
      const statusCode = error.statusCode ?? 500;
      res.status(statusCode).json({
        error: error.message,
      });
    }
  }
}

export default ChangePasswordAction;
