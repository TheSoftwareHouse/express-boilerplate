import { QueryHandler } from "@tshio/query-bus";
import { Repository } from "typeorm";
import { {{pascalCase name}}Entity } from "../models/{{kebabCase name}}.entity";
import { {{constantCase name}}_LIST_QUERY_TYPE, {{pascalCase name}}ListQuery, {{pascalCase name}}ListQueryResult } from "../queries/{{kebabCase name}}-list";

export interface {{pascalCase name}}ListQueryHandlerDependencies {
  {{camelCase name}}Repository: Repository<{{pascalCase name}}Entity>;
}

export default class {{pascalCase name}}ListQueryHandler implements QueryHandler<{{pascalCase name}}ListQuery, {{pascalCase name}}ListQueryResult> {
  public queryType: string = {{constantCase name}}_LIST_QUERY_TYPE;

  constructor(private dependencies: {{pascalCase name}}ListQueryHandlerDependencies) {}

  async execute(query: {{pascalCase name}}ListQuery): Promise<{{pascalCase name}}ListQueryResult> {
    const [result, total] = await this.dependencies.{{camelCase name}}Repository
      .createQueryBuilder("{{camelCase name}}")
      .buildQueryByTypeOrmMapper(query.payload.typeormMapperDTO)
      .getManyAndCount();

    return new {{pascalCase name}}ListQueryResult({ result, total });
  }
}
