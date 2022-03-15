import { QueryResult } from "@tshio/query-bus";

export class {{pascalCase name}}DetailsQueryResult implements QueryResult<any> {
  constructor(public result: any) {}
}
