import {Request, Response, NextFunction} from 'express';
import { celebrate, Joi } from "celebrate";
{{#eq method "get"}}
import { QueryBus } from "../../../../shared/query-bus";
import { {{capitalize name.camelCased}}Query } from "../queries/{{name.kebabCased}}.query";
{{else}}
import { CommandBus } from "../../../../shared/command-bus";
import { {{capitalize name.camelCased}}Command } from "../commands/{{name.kebabCased}}.command";
{{/eq}}

{{#eq method "get"}}
export interface {{capitalize name.camelCased}}ActionProps {
  queryBus: QueryBus
}
{{else}}
export interface {{capitalize name.camelCased}}ActionProps {
  commandBus: CommandBus
}
{{/eq}}


export const {{name.camelCased}}ActionValidation = celebrate(
  {
    headers: Joi.object()
  },
  { abortEarly: false }
);

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
{{#eq method "get"}}
export const {{name.camelCased}}Action = ({queryBus}: {{capitalize name.camelCased}}ActionProps) => (req: Request, res: Response, next: NextFunction) => {
  queryBus
    .execute(new {{capitalize name.camelCased}}Query({
      // command props
    }))
    .then(queryResult => {
      // response
    })
    .catch(next);
};
{{else}}
export const {{name.camelCased}}Action = ({commandBus}: {{capitalize name.camelCased}}ActionProps) => (req: Request, res: Response, next: NextFunction) => {
  commandBus
    .execute(new {{capitalize name.camelCased}}Command({
      // command props
    }))
    .then(commandResult => {
      res.json(commandResult.result)
    })
    .catch(next);
};
{{/eq}}