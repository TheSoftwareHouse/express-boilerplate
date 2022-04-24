import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "@tshio/command-bus";
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

class Update{{pascalCase name}}Action implements Action {
  constructor(private dependencies: Update{{pascalCase name}}ActionDependencies) {}

  async invoke({ body, params }: Request, res: Response) {
    const commandResult = await this.dependencies.commandBus.execute(new Update{{pascalCase name}}Command({...body, id: params.id}));

    res.json(commandResult.result);
  }
}
export default Update{{pascalCase name}}Action;
