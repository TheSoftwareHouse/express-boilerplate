import { QueryHandler } from "../../../../shared/query-bus";
import { CacheQuery } from "../../../../shared/cache-decorator";
import { USERS_QUERY_TYPE, UsersQuery, UsersQueryResult } from "../queries/users";

export default class UsersQueryHandler implements QueryHandler<UsersQuery, UsersQueryResult> {
  public queryType: string = USERS_QUERY_TYPE;

  @CacheQuery({ duration: 10 })
  async execute(_query: UsersQuery): Promise<UsersQueryResult> {
    const fakeUsers = [{ firstName: "John", lastName: "Doe" }];
    return new UsersQueryResult(fakeUsers);
  }
}
