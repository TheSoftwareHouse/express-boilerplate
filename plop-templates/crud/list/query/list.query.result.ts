import { QueryResult } from "@tshio/query-bus";

export class {{pascalCase name}}ListQueryResult implements QueryResult<any> {
  constructor(public result: any) {}
}
