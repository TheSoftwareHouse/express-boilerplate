import { QueryResult } from "../../../../../shared/query-bus";

export class {{pascalCase name}}QueryResult implements QueryResult<any> {
  constructor(public result: any) {}
}
