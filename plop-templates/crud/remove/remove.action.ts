import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "@tshio/command-bus";
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

class Remove{{pascalCase name}}Action implements Action {
  constructor(private dependencies: Remove{{pascalCase name}}ActionDependencies) {}

  async invoke({ params }: Request, res: Response) {
    const commandResult = await this.dependencies.commandBus.execute(
      new Remove{{pascalCase name}}Command({
        id: params.id,
      }),
    );

    res.json(commandResult.result);
  }
}
export default Remove{{pascalCase name}}Action;
