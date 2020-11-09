import { QueryResult } from "../../../../../shared/query-bus";

export class UsersQueryResult implements QueryResult<any> {
  constructor(public result: any) {}
}
