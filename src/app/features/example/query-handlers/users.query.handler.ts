import { Like, Repository } from "typeorm";
import { QueryHandler } from "@tshio/query-bus";
import { CacheQuery } from "../../../../shared/cache-decorator";
import { USERS_QUERY_TYPE, UsersQuery, UsersQueryResult } from "../queries/users";
import { UserEntity } from "../models/user.entity";
import { createFindManyOptions, makePaginationResult } from "../../../../shared/pagination-utils/pagination-utils";

export interface UsersQueryHandlerInterface {
  userRepository: Repository<UserEntity>;
}
export default class UsersQueryHandler implements QueryHandler<UsersQuery, UsersQueryResult> {
  public queryType: string = USERS_QUERY_TYPE;

  constructor(private dependencies: UsersQueryHandlerInterface) {}

  @CacheQuery({ duration: 10 })
  async execute(query: UsersQuery): Promise<UsersQueryResult> {
    const { payload } = query;
    const findOptions = createFindManyOptions(this.dependencies.userRepository, payload);

    if (payload.search) {
      findOptions.where = { ...findOptions.where, email: Like(`%${payload.search}%`) };
    }
    const [data, total] = await this.dependencies.userRepository.findAndCount(findOptions);

    return new UsersQueryResult(makePaginationResult(data, total, findOptions, payload.search));
  }
}
