import { Request, Response, NextFunction } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "../../../../shared/command-bus";
import { LoginCommand } from "../commands/login.command";

export interface LoginActionProps {
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
const loginAction = ({ commandBus }: LoginActionProps) => (req: Request, res: Response, next: NextFunction) => {
  commandBus
    .execute(
      new LoginCommand({
        authToken: req.body.authToken,
      }),
    )
    .then(commandResult => {
      res.json(commandResult);
    })
    .catch(next);
};

export default loginAction;
