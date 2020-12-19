import { Query } from "@tshio/query-bus";

export const USERS_QUERY_TYPE = "example/USERS";

export interface UsersQueryPayload {}

export class UsersQuery implements Query<UsersQueryPayload> {
  public type: string = USERS_QUERY_TYPE;

  constructor(public payload: UsersQueryPayload) {}
}
