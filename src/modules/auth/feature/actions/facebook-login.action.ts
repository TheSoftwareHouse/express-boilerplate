import { NextFunction, Request, Response } from "express";
import { SecurityClient } from "@tshio/security-client";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { decode } from "jsonwebtoken";
import { CommandBus } from "@tshio/command-bus";
import { Action } from "../../../../shared/http/types";
import { ProfileRepository } from "../repositories/profile.repostiory";

export interface FacebookLoginActionDependencies {
  commandBus: CommandBus;
  securityClient: SecurityClient;
  profileRepository: ProfileRepository;
}

@ApiPath({
  path: "/api",
  name: "Auth",
})
class FacebookLoginAction implements Action {
  constructor(private dependencies: FacebookLoginActionDependencies) {}

  @ApiOperationPost({
    path: "/auth/login/facebook",
    description: "Facebook login example",
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
    const { securityClient, profileRepository } = this.dependencies;

    try {
      const tokens = await securityClient.auth.facebookLogin(body);
      const { user_id: id, username } = decode(tokens.accessToken) as any;

      const profile = await profileRepository.findById(id);

      if (!profile) {
        await profileRepository.addProfile({
          id,
          username,
        });
      }

      res.json(tokens);
    } catch (error) {
      next(error);
    }
  }
}

export default FacebookLoginAction;
