import { Query } from "../../../../../shared/query-bus";

export const USERS_QUERY_TYPE = "users/USERS";

export interface UsersQueryPayload {}

export class UsersQuery implements Query<UsersQueryPayload> {
  public type: string = USERS_QUERY_TYPE;

  constructor(public payload: UsersQueryPayload) {}
}
