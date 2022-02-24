import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { ApiOperationGet, ApiPath } from "swagger-express-ts";
import { QueryBus } from "@tshio/query-bus";
import { {{pascalCase name}}DetailsQuery } from "../queries/{{kebabCase name}}-details";
import { Action } from "../../../../shared/http/types";

export interface {{pascalCase name}}DetailsActionDependencies {
  queryBus: QueryBus;
}

export const {{camelCase name}}DetailsActionValidation = celebrate(
  {
    headers: Joi.object(),
  },
  { abortEarly: false },
);

@ApiPath({
  path: "/api",
  name: "{{getName module}}",
})
class {{pascalCase name}}DetailsAction implements Action {
  constructor(private dependencies: {{pascalCase name}}DetailsActionDependencies) {}

  @ApiOperationGet({
    path: "/{{getName module}}/{{kebabCase name}}/{id}",
    description: "{{titleCase name}} details",
    summary: "{{titleCase name}} details",
    parameters: {
      path: {
        id: {
          type: "string",
          required: true,
          format: "uuid",
          description: "5e93eeb4-bf85-4b75-a34d-15e907d98075",
        },
      }
    },
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
    const queryResult = await this.dependencies.queryBus.execute(
      new {{pascalCase name}}DetailsQuery({id: req.params.id}),
    );

    res.json(queryResult.result);
  }
}
export default {{pascalCase name}}DetailsAction;
