import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { CommandBus } from "@tshio/command-bus";
{{#eq method "get"}}
import { QueryBus } from "@tshio/query-bus";
import { {{pascalCase name}}Query } from "../queries/{{kebabCase name}}";
{{else}}
import { {{pascalCase name}}Command } from "../commands/{{kebabCase name}}.command";
{{/eq}}
import { Action } from "../../../../shared/http/types";

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

{{#eq method "get"}}
class {{pascalCase name}}Action implements Action {
  constructor(private dependencies: {{pascalCase name}}ActionDependencies) {}

  async invoke(req: Request, res: Response) {
    const queryResult = await this.dependencies.queryBus.execute(
      new {{pascalCase name}}Query({
        // query props
      }),
    );

    res.json(queryResult.result);
  }
}
{{else}}
class {{pascalCase name}}Action implements Action {
  constructor(private dependencies: {{pascalCase name}}ActionDependencies) {}

  async invoke({ body }: Request, res: Response) {
    const commandResult = await this.dependencies.commandBus.execute(
      new {{pascalCase name}}Command({
        // command props
      }),
    );

    res.json(commandResult.result);
  }
}
{{/eq}}
export default {{pascalCase name}}Action;
