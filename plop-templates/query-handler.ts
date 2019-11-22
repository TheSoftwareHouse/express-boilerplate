

import { QueryHandler } from "../../../../shared/query-bus";
import { {{name.capitalSnake}}_QUERY_TYPE, {{capitalize name.camelCased}}Query, {{capitalize name.camelCased}}QueryResult } from "../queries/{{name.kebabCased}}.query";

export default class {{capitalize name.camelCased}}QueryHandler implements QueryHandler<{{capitalize name.camelCased}}Query, {{capitalize name.camelCased}}QueryResult> {
  public queryType: string = {{name.capitalSnake}}_QUERY_TYPE

  async execute(command: {{capitalize name.camelCased}}Query): Promise<{{capitalize name.camelCased}}QueryResult> {
    // execute body
    return new {{capitalize name.camelCased}}QueryResult({})
  };
}