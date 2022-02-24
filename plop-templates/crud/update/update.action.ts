import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "@tshio/command-bus";
import { ApiOperationPatch, ApiPath } from "swagger-express-ts";
import { Update{{pascalCase name}}Command } from "../commands/update-{{kebabCase name}}.command";
import { Action } from "../../../../shared/http/types";

export interface Update{{pascalCase name}}ActionDependencies {
  commandBus: CommandBus;
}

export const update{{pascalCase name}}ActionValidation = celebrate(
  {
    headers: Joi.object(),
  },
  { abortEarly: false },
);

@ApiPath({
  path: "/api",
  name: "{{getName module}}  ",
})
class Update{{pascalCase name}}Action implements Action {
  constructor(private dependencies: Update{{pascalCase name}}ActionDependencies) {}

  @ApiOperationPatch({
    path: "/{{getName module}}/{{kebabCase name}}/{id}  ",
    description: "Update {{titleCase name}}",
    summary: "Update {{titleCase name}}",
    parameters: {
      body: {},
      path: {
        id: {
          type: "string",
          required: true,
          format: "uuid",
          description: "5e93eeb4-bf85-4b75-a34d-15e907d98075",
        },
      }
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
  async invoke({ body, params }: Request, res: Response) {
    const commandResult = await this.dependencies.commandBus.execute(new Update{{pascalCase name}}Command({...body, id: params.id}));

    res.json(commandResult.result);
  }
}
export default Update{{pascalCase name}}Action;
