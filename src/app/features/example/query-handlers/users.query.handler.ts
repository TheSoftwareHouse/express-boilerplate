import { Repository } from "typeorm";
import { QueryHandler } from "@tshio/query-bus";
import { CacheQuery } from "../../../../shared/cache-decorator";
import { USERS_QUERY_TYPE, UsersQuery, UsersQueryResult } from "../queries/users";
import { UserEntity } from "../models/user.entity";
import { calculateSkipFindOption, isFilterAvailable, makePaginationResult } from "../../../../shared/pagination-meta/pagination-meta";

export interface UsersQueryHandlerInterface {
  userRepository: Repository<UserEntity>;
}
export default class UsersQueryHandler implements QueryHandler<UsersQuery, UsersQueryResult> {
  public queryType: string = USERS_QUERY_TYPE;

  constructor(private dependencies: UsersQueryHandlerInterface) {}

  @CacheQuery({ duration: 10 })
  async execute(query: UsersQuery): Promise<UsersQueryResult> {
    const { page, limit, sort, filter } = query.payload;
    const findOptions = {} as any;

    if (limit && page) {
      findOptions.take = limit;
      findOptions.skip = calculateSkipFindOption(page, limit);
    }

    if (sort && isFilterAvailable(sort, this.dependencies.userRepository)) {
      findOptions.order = sort;
    }

    if (filter && isFilterAvailable(filter, this.dependencies.userRepository)) {
      findOptions.where = filter;
    }

    const [data, total] = await this.dependencies.userRepository.findAndCount(findOptions);

    return new UsersQueryResult(makePaginationResult(data, total, limit, page));
  }
}
