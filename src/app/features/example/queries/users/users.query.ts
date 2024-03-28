import { Query } from "@tshio/query-bus";
import { PaginationParamsDto } from "../../../../../shared/pagination-utils/pagination-utils";

export const USERS_QUERY_TYPE = "example/USERS";

export interface UsersQueryPayload extends PaginationParamsDto {}

export class UsersQuery implements Query<UsersQueryPayload> {
  public type: string = USERS_QUERY_TYPE;

  constructor(public payload: UsersQueryPayload) {}
}
