import { QueryResult } from "@tshio/query-bus";

export class MeQueryResult implements QueryResult<any> {
  constructor(public result: any) {}
}
