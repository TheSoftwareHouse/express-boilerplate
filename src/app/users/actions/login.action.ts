import { Request, Response, NextFunction } from "express";
import { CommandBus } from "../../../shared/command-bus";
import { LoginCommand } from "../commands/login.command";

export interface LoginActionProps {
  commandBus: CommandBus;
}

/**
 * @swagger
 *
 * /api/login:
 *   post:
 *     consumes:
 *      - application/json
 *     produces:
 *      - application/json
 *     summary: login to app
 *     parameters:
 *      - in: body
 *        required: true
 *        name: body
 *        schema:
 *         type: object
 *         properties:
 *          authToken:
 *           type: string
 *     responses:
 *       201:
 *        description: auth success
 *        schema:
 *          type: object
 *          properties:
 *           accessToken:
 *             type: string
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
export const loginAction = ({ commandBus }: LoginActionProps) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
