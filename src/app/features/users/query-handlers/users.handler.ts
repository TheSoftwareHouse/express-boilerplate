import { QueryHandler } from "../../../../shared/query-bus";
import { USERS_QUERY_TYPE, UsersQuery, UsersQueryResult } from "../queries/users.query";

export default class UsersQueryHandler implements QueryHandler<UsersQuery, UsersQueryResult> {
  public queryType: string = USERS_QUERY_TYPE;

  async execute(command: UsersQuery): Promise<UsersQueryResult> {
    // execute body
    return new UsersQueryResult([]);
  }
}
