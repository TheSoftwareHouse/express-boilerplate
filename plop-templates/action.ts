import {Request, Response, NextFunction} from 'express';
import { CommandBus } from "../../../shared/command-bus";
import { {{capitalize name.camelCased}}Command } from "../commands/{{name.kebabCased}}.command";

export interface {{capitalize name.camelCased}}ActionProps {
  commandBus: CommandBus
}

/**
 * @swagger
 *
 * /api/{{getName module}}/{{name.kebabCased}}:
 *   {{method}}:
 *     description: desc
 *     responses:
 *       201:
 *         description: desc
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
export const {{name.camelCased}}Action = ({commandBus}: {{capitalize name.camelCased}}ActionProps) => (req: Request, res: Response, next: NextFunction) => {
  commandBus
    .execute(new {{capitalize name.camelCased}}Command({
      // command props
    }))
    .then(commandResult => {
      // response
    })
    .catch(next);
};
