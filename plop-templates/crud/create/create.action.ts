import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "@tshio/command-bus";
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

class Create{{pascalCase name}}Action implements Action {
  constructor(private dependencies: Create{{pascalCase name}}ActionDependencies) {}

  async invoke({ body }: Request, res: Response) {
    const commandResult = await this.dependencies.commandBus.execute(new Create{{pascalCase name}}Command(body));

    res.status(StatusCodes.CREATED);
    res.json(commandResult.result);
  }
}
export default Create{{pascalCase name}}Action;
