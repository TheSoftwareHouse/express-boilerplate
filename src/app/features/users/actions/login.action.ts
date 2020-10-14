import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "../../../../shared/command-bus";
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

/**
 * @swagger
 *
 * /api/users/login:
 *   post:
 *     security: []
 *     summary: login to app
 *     requestBody:
 *       content:
 *         application/json:
 *          schema:
 *            type: object
 *            properties:
 *              authToken:
 *                type: string
 *     responses:
 *       200:
 *        description: auth success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                accessToken:
 *                  type: string
 *                refreshToken:
 *                  type: string
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
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
