import { Request, Response } from "express";
import { ApiOperationGet, ApiPath } from "swagger-express-ts";
import { FORBIDDEN } from "http-status-codes";
import { Action } from "../../../../shared/http/types";
import { ProfileRepository } from "../repositories/profile.repostiory";

export interface MeActionDependencies {
  profileRepository: ProfileRepository;
}

@ApiPath({
  path: "/api",
  name: "Auth",
})
class MeAction implements Action {
  constructor(private dependencies: MeActionDependencies) {}

  @ApiOperationGet({
    path: "/auth/me",
    description: "Profile example",
    security: {
      bearerAuth: [],
    },
    parameters: {},
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
    const { profileRepository } = this.dependencies;

    const { tokenInfo } = res.locals;

    const { userId } = tokenInfo;

    const profile = await profileRepository.findById(userId);

    if (!profile) {
      res.status(FORBIDDEN).json({
        error: "Forbidden",
      });
      return;
    }

    res.json(profile);
  }
}

export default MeAction;
