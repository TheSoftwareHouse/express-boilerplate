import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "@tshio/command-bus";
import { ApiOperationPost, ApiPath } from "swagger-express-ts";
import { StatusCodes } from "http-status-codes";
import { Create{{pascalCase name}}Command } from "../commands/create-{{kebabCase name}}.command";
import { Action } from "../../../../shared/http/types";

export interface Create{{pascalCase name}}ActionDependencies {
  commandBus: CommandBus;
}

export const create{{pascalCase name}}ActionValidation = celebrate(
  {
    headers: Joi.object(),
  },
  { abortEarly: false },
);

@ApiPath({
  path: "/api",
  name: "{{getName module true}} / {{titleCase name}}",
})
class Create{{pascalCase name}}Action implements Action {
  constructor(private dependencies: Create{{pascalCase name}}ActionDependencies) {}

  @ApiOperationPost({
    path: "/{{getName module false}}/{{kebabCase name}}",
    description: "Create {{titleCase name}}",
    summary: "Create {{titleCase name}}",
    parameters: {
      body: {}
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
  async invoke({ body }: Request, res: Response) {
    const commandResult = await this.dependencies.commandBus.execute(new Create{{pascalCase name}}Command(body));

    res.status(StatusCodes.CREATED);
    res.json(commandResult.result);
  }
}
export default Create{{pascalCase name}}Action;
