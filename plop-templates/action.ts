import {Request, Response, NextFunction} from 'express';
import { CommandBus } from "../../../../shared/command-bus";
import { {{capitalize name.camelCased}}Command } from "../commands/{{name.snakeCased}}.command";

/**
 * @swagger
 *
 * /api/{{getName module}}/{{name.camelCased}}:
 *   get:
 *     description: Return greeting
 *     responses:
 *       201:
 *         description: returns greeting
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
export const {{capitalize name.camelCased}} = ({commandBus}: {commandBus: CommandBus}) => (req: Request, res: Response, next: NextFunction) => {
  commandBus
    .execute(new {{capitalize name.camelCased}}Command({
      // command props
    }))
    .then(commandResult => {
      // response
    })
    .catch(next);
};
