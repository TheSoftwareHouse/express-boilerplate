import { QueryHandler } from "@tshio/query-bus";
import { {{constantCase name}}_QUERY_TYPE, {{pascalCase name}}Query, {{pascalCase name}}QueryResult } from "../queries/{{kebabCase name}}";

export default class {{pascalCase name}}QueryHandler implements QueryHandler<{{pascalCase name}}Query, {{pascalCase name}}QueryResult> {
  public queryType: string = {{constantCase name}}_QUERY_TYPE;

  async execute(query: {{pascalCase name}}Query): Promise<{{pascalCase name}}QueryResult> {
    // do something with the query and transform it to result.
    return new {{pascalCase name}}QueryResult(query);
  }
}
