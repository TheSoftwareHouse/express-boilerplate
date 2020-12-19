import { classToPlain } from "class-transformer";
import { QueryHandler } from "@tshio/query-bus";
import { CacheQuery } from "../../../../shared/cache-decorator";
import { USERS_QUERY_TYPE, UsersQuery, UsersQueryResult } from "../queries/users";
import { User } from "../models/user.dto";

export default class UsersQueryHandler implements QueryHandler<UsersQuery, UsersQueryResult> {
  public queryType: string = USERS_QUERY_TYPE;

  @CacheQuery({ duration: 10 })
  async execute(_query: UsersQuery): Promise<UsersQueryResult> {
    const fakeUsers = [User.create({ firstName: "John", lastName: "Doe", email: "john@example.com" })];
    return new UsersQueryResult(classToPlain(fakeUsers));
  }
}
