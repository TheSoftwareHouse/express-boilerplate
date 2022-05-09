import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "@tshio/command-bus";
import { LoginCommand } from "../commands/login.command";
import { Action } from "../../../../shared/http/types";

export interface LoginActionDependencies {
  commandBus: CommandBus;
}

export const loginActionValidation = celebrate(
  {
    body: Joi.object().keys({
      authToken: Joi.string().required(),
    }),
  },
  { abortEarly: false },
);

class LoginAction implements Action {
  constructor(private dependencies: LoginActionDependencies) {}

  async invoke({ body }: Request, res: Response) {
    const result = await this.dependencies.commandBus.execute(
      new LoginCommand({
        authToken: body.authToken,
      }),
    );

    res.json(result);
  }
}

export default LoginAction;
