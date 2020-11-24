import { Request, Response } from "express";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "../../../../shared/command-bus";
import { Action } from "../../../../shared/http/types";

export interface MeActionDependencies {
  commandBus: CommandBus;
}

export const meActionValidation = celebrate(
  {
    body: Joi.object().keys({
      authToken: Joi.string().required(),
    }),
  },
  { abortEarly: false },
);

@ApiPath({
  path: "/api",
  name: "Auth",
})
class MeAction implements Action {
  constructor(private dependencies: MeActionDependencies) {}

  @ApiOperationPost({
    path: "/auth/me",
    description: "Profile example",
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
    res.json(body);
  }
}

export default MeAction;
