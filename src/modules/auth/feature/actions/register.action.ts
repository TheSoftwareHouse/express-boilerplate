import { Request, Response } from "express";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { SecurityClient } from "@tshio/security-client/dist/services/security-client";
import { CREATED, INTERNAL_SERVER_ERROR } from "http-status-codes";
import { Action } from "../../../../shared/http/types";
import { ProfileRepository } from "../repositories/profile.repostiory";
import { AuthModuleConfig } from "../../config/auth";
import { ProfileModel } from "../models/profile.model";

export interface RegisterActionDependencies {
  profileRepository: ProfileRepository;
  authModuleConfig: AuthModuleConfig;
  securityClient: SecurityClient;
}

@ApiPath({
  path: "/api",
  name: "Auth",
})
class RegisterAction implements Action {
  constructor(private dependencies: RegisterActionDependencies) {}

  @ApiOperationPost({
    path: "/auth/register",
    description: "Register example",
    parameters: {
      body: {
        properties: {
          email: {
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
  async invoke(req: Request, res: Response) {
    const { profileRepository, authModuleConfig, securityClient } = this.dependencies;

    const { username, password } = req.body;

    const user = {
      username,
      password,
      attributes: ["NEW_USER"],
    };

    try {
      const { newUserId } = await securityClient.users.addUser(user, { apiKey: authModuleConfig.apiKey });

      const profile = ProfileModel.create({
        id: newUserId,
        username,
      });

      await profileRepository.addProfile(profile);

      res.status(CREATED).json({
        status: "success",
        newUserId,
      });
    } catch (error) {
      const statusCode = error.statusCode ?? INTERNAL_SERVER_ERROR;
      res.status(statusCode).json({
        error: error.message,
      });
    }
  }
}

export default RegisterAction;
