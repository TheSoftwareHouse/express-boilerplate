import { QueryResult } from "@tshio/query-bus";

export class UsersQueryResult implements QueryResult<any> {
  constructor(public result: any) {}
}
