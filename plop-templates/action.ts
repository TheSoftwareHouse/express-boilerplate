import { Request, Response, NextFunction } from "express";
import { celebrate, Joi } from "celebrate";
{{#eq method "get"}}
import { QueryBus } from "../../../../shared/query-bus";
import { {{pascalCase name}}Query } from "../queries/{{kebabCase name}}";
{{else}}
import { CommandBus } from "../../../../shared/command-bus";
import { {{pascalCase name}}Command } from "../commands/{{kebabCase name}}.command";
{{/eq}}

{{#eq method "get"}}
export interface {{pascalCase name}}ActionDependencies {
  queryBus: QueryBus;
}
{{else}}
export interface {{pascalCase name}}ActionDependencies {
  commandBus: CommandBus;
}
{{/eq}}

export const {{camelCase name}}ActionValidation = celebrate(
  {
    headers: Joi.object(),
  },
  { abortEarly: false },
);

/**
 * @swagger
 *
 * /api/{{getName module}}/{{kebabCase name}}:
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
const {{camelCase name}}Action = ({ queryBus }: {{pascalCase name}}ActionDependencies) => (req: Request, res: Response, next: NextFunction) => {
  queryBus
    .execute(
      new {{pascalCase name}}Query({
        // query props
      }),
    )
    .then(queryResult => {
      res.json(queryResult.result)
    })
    .catch(next);
};
{{else}}
const {{camelCase name}}Action = ({ commandBus }: {{pascalCase name}}ActionDependencies) => (req: Request, res: Response, next: NextFunction) => {
  commandBus
    .execute(
      new {{pascalCase name}}Command({
      // command props
      }),
    )
    .then(commandResult => {
      res.json(commandResult.result);
    })
    .catch(next);
};
{{/eq}}
export default {{camelCase name}}Action;
