import { QueryHandler } from "@tshio/query-bus";
import { Repository } from "typeorm";
import { NotFoundError } from "../../../../errors/not-found.error";
import { {{pascalCase name}}Model } from "../models/{{kebabCase name}}.model";
import { {{constantCase name}}_DETAILS_QUERY_TYPE, {{pascalCase name}}DetailsQuery, {{pascalCase name}}DetailsQueryResult } from "../queries/{{kebabCase name}}-details";

export interface {{pascalCase name}}DetailsQueryHandlerDependencies {
    {{camelCase name}}Repository: Repository<{{pascalCase name}}Model>;
}

export default class {{pascalCase name}}DetailsQueryHandler /* eslint-disable-next-line */
  implements QueryHandler<{{pascalCase name}}DetailsQuery, {{pascalCase name}}DetailsQueryResult> {
  public queryType: string = {{constantCase name}}_DETAILS_QUERY_TYPE;

  constructor(private dependencies: {{pascalCase name}}DetailsQueryHandlerDependencies) {}

  async execute(query: {{pascalCase name}}DetailsQuery): Promise<{{pascalCase name}}DetailsQueryResult> {
    const {{camelCase name}}Model = await this.dependencies.{{camelCase name}}Repository.findOne(query.payload.id);

    if (!{{camelCase name}}Model) {
      throw new NotFoundError("{{camelCase name}} not found");
    }

    return new {{pascalCase name}}DetailsQueryResult({{camelCase name}}Model);
  }
}
