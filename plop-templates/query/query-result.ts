import { QueryResult } from "@tshio/query-bus";

export class {{pascalCase name}}QueryResult implements QueryResult<any> {
  constructor(public result: any) {}
}
