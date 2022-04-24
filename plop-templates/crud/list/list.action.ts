import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { QueryBus } from "@tshio/query-bus";
import { {{pascalCase name}}ListQuery } from "../queries/{{kebabCase name}}-list";
import { Action } from "../../../../shared/http/types";
import { dtoToTypeormMapper } from "../../../../shared/typeorm/mapper/dto-to-typeorm-mapper";

export interface {{pascalCase name}}ListActionDependencies {
  queryBus: QueryBus<any>;
}

export const {{camelCase name}}ListActionValidation = celebrate(
  {
    headers: Joi.object(),
  },
  { abortEarly: false },
);

class {{pascalCase name}}ListAction implements Action {
  constructor(private dependencies: {{pascalCase name}}ListActionDependencies) {}

  async invoke(req: Request, res: Response) {
    const typeormMapperDTO = dtoToTypeormMapper(req);

    const queryResult = await this.dependencies.queryBus.execute(new {{pascalCase name}}ListQuery({ typeormMapperDTO }));

    res.json(queryResult.result);
  }
}
export default {{pascalCase name}}ListAction;
