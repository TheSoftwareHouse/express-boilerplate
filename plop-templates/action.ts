import { Request, Response } from "express";
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
const {{camelCase name}}Action = ({ queryBus }: {{pascalCase name}}ActionDependencies) => async (req: Request, res: Response) => {
  const queryResult = await queryBus.execute(
    new {{pascalCase name}}Query({
      // query props
    }),
  );
  return res.json(queryResult.result);
};
{{else}}
const {{camelCase name}}Action = ({ commandBus }: {{pascalCase name}}ActionDependencies) => async (req: Request, res: Response) => {
  const commandResult = await commandBus.execute(
    new {{pascalCase name}}Command({
      // command props
    }),
  );

  return res.json(commandResult.result);
};
{{/eq}}
export default {{camelCase name}}Action;
