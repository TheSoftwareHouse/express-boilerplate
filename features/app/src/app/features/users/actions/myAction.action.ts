import {Request, Response, NextFunction} from 'express';
import { celebrate } from "celebrate";
import { CommandBus } from "../../../shared/command-bus";
import { MyActionCommand } from "../commands/myAction.command";

export interface MyActionActionProps {
  commandBus: CommandBus
}

export const myActionActionValidation = celebrate(
  {},
  { abortEarly: false }
);

/**
 * @swagger
 *
 * /api/users/myAction:
 *   get:
 *     description: desc
 *     responses:
 *       201:
 *         description: desc
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
export const myActionAction = ({commandBus}: MyActionActionProps) => (req: Request, res: Response, next: NextFunction) => {
  commandBus
    .execute(new MyActionCommand({
      // command props
    }))
    .then(commandResult => {
      // response
    })
    .catch(next);
};
