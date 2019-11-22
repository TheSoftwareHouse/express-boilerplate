import { Query, QueryResult } from "../../../../shared/query-bus";

export const {{name.capitalSnake}}_QUERY_TYPE = '{{getName module}}/{{uppercase name.camelCased}}';

export interface {{capitalize name.camelCased}}QueryPayload {
}

export class {{capitalize name.camelCased}}Query implements Query<{{capitalize name.camelCased}}QueryPayload> {
  public type: string = {{name.capitalSnake}}_QUERY_TYPE;

  constructor(public payload: {{capitalize name.camelCased}}QueryPayload) {}
}

export class {{capitalize name.camelCased}}QueryResult implements QueryResult<any> {
  constructor(public result: any) {}
}