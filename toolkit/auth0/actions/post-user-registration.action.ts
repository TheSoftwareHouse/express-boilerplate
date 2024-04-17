import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "@tshio/command-bus";
import { PostUserRegistrationCommand } from "../commands/post-user-registration.command";
import { Action } from "../../../../shared/http/types";

export interface PostUserRegistrationActionDependencies {
  commandBus: CommandBus;
}

export const postUserRegistrationActionValidation = celebrate(
  {
    headers: Joi.object(),
    body: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  },
  { abortEarly: false },
);

class PostUserRegistrationAction implements Action {
  constructor(private dependencies: PostUserRegistrationActionDependencies) {}

  async invoke({ body }: Request, res: Response) {
    const commandResult = await this.dependencies.commandBus.execute(
      new PostUserRegistrationCommand({
        userId: body.userId,
      }),
    );

    res.json(commandResult.result);
  }
}
export default PostUserRegistrationAction;
