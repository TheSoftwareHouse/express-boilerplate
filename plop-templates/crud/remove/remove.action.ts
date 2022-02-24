import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "@tshio/command-bus";
import { ApiOperationDelete, ApiPath } from "swagger-express-ts";
import { Remove{{pascalCase name}}Command } from "../commands/remove-{{kebabCase name}}.command";
import { Action } from "../../../../shared/http/types";

export interface Remove{{pascalCase name}}ActionDependencies {
  commandBus: CommandBus;
}

export const remove{{pascalCase name}}ActionValidation = celebrate(
  {
    headers: Joi.object(),
  },
  { abortEarly: false },
);

@ApiPath({
  path: "/api",
  name: "{{getName module true}} / {{titleCase name}}",
})
class Remove{{pascalCase name}}Action implements Action {
  constructor(private dependencies: Remove{{pascalCase name}}ActionDependencies) {}

  @ApiOperationDelete({
    path: "/{{getName module false}}/{{kebabCase name}}/{id} ",
    description: "Remove {{titleCase name}}",
    summary: "Remove {{titleCase name}}",
    parameters: {
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
  async invoke({ params }: Request, res: Response) {
    const commandResult = await this.dependencies.commandBus.execute(
      new Remove{{pascalCase name}}Command({
        id: params.id
      }),
    );

    res.json(commandResult.result);
  }
}
export default Remove{{pascalCase name}}Action;
