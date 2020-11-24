import { Request, Response } from "express";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { CommandBus } from "../../../../shared/command-bus";
import { Action } from "../../../../shared/http/types";
import { ProfileRepository } from "../repositories/profile.repostiory";

export interface MeActionDependencies {
  commandBus: CommandBus;
  profileRepository: ProfileRepository;
}

@ApiPath({
  path: "/api",
  name: "Auth",
})
class MeAction implements Action {
  constructor(private dependencies: MeActionDependencies) {}

  @ApiOperationPost({
    path: "/auth/me",
    description: "Profile example",
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

    res.json({});
  }
}

export default MeAction;
