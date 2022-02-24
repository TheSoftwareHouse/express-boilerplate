import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { ApiOperationGet, ApiPath } from "swagger-express-ts";
import { QueryBus } from "@tshio/query-bus";
import { {{pascalCase name}}ListQuery } from "../queries/{{kebabCase name}}-list";
import { Action } from "../../../../shared/http/types";
import { dtoToTypeormMapper } from "../../../../shared/typeorm/mapper/dto-to-typeorm-mapper";

export interface {{pascalCase name}}ListActionDependencies {
  queryBus: QueryBus;
}

export const {{camelCase name}}ListActionValidation = celebrate(
  {
    headers: Joi.object(),
  },
  { abortEarly: false },
);

@ApiPath({
  path: "/api",
  name: "{{getName module true}} / {{titleCase name}}",
})
class {{pascalCase name}}ListAction implements Action {
  constructor(private dependencies: {{pascalCase name}}ListActionDependencies) {}

  @ApiOperationGet({
    path: "/{{getName module false}}",
    description: "{{titleCase name}} list",
    summary: "{{titleCase name}} list",
    responses: {
      200: {
        description: "Success",
      },
      400: {
        description: "Validation error",
      },
      500: {
        description: "Internal Server Error",
      },
    },
  })
  async invoke(req: Request, res: Response) {
    const typeormMapperDTO = dtoToTypeormMapper(req);

    const queryResult = await this.dependencies.queryBus.execute(new {{pascalCase name}}ListQuery({ typeormMapperDTO }));

    res.json(queryResult.result);
  }
}
export default {{pascalCase name}}ListAction;
