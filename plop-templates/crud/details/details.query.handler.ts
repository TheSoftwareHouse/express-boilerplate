import { QueryHandler } from "@tshio/query-bus";
import { Repository } from "typeorm";
import { NotFoundError } from "../../../../errors/not-found.error";
import { {{pascalCase name}}Entity } from "../models/{{kebabCase name}}.entity";
import { {{constantCase name}}_DETAILS_QUERY_TYPE, {{pascalCase name}}DetailsQuery, {{pascalCase name}}DetailsQueryResult } from "../queries/{{kebabCase name}}-details";

export interface {{pascalCase name}}DetailsQueryHandlerDependencies {
  {{camelCase name}}Repository: Repository<{{pascalCase name}}Entity>;
}

export default class {{pascalCase name}}DetailsQueryHandler /* eslint-disable-next-line */
  implements QueryHandler<{{pascalCase name}}DetailsQuery, {{pascalCase name}}DetailsQueryResult> {
  public queryType: string = {{constantCase name}}_DETAILS_QUERY_TYPE;

  constructor(private dependencies: {{pascalCase name}}DetailsQueryHandlerDependencies) {}

  async execute(query: {{pascalCase name}}DetailsQuery): Promise<{{pascalCase name}}DetailsQueryResult> {
    const {{camelCase name}}Entity = await this.dependencies.{{camelCase name}}Repository.findOneBy({
      id: query.payload.id,
    });

    if (!{{camelCase name}}Entity) {
      throw new NotFoundError("{{camelCase name}} not found");
    }

    return new {{pascalCase name}}DetailsQueryResult({{camelCase name}}Entity);
  }
}
