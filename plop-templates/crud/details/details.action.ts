import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { QueryBus } from "@tshio/query-bus";
import { {{pascalCase name}}DetailsQuery } from "../queries/{{kebabCase name}}-details";
import { Action } from "../../../../shared/http/types";

export interface {{pascalCase name}}DetailsActionDependencies {
  queryBus: QueryBus<any>;
}

export const {{camelCase name}}DetailsActionValidation = celebrate(
  {
    headers: Joi.object(),
  },
  { abortEarly: false },
);

class {{pascalCase name}}DetailsAction implements Action {
  constructor(private dependencies: {{pascalCase name}}DetailsActionDependencies) {}

  async invoke(req: Request, res: Response) {
    const queryResult = await this.dependencies.queryBus.execute(
      new {{pascalCase name}}DetailsQuery({id: req.params.id}),
    );

    res.json(queryResult.result);
  }
}
export default {{pascalCase name}}DetailsAction;
