import { Query } from "@tshio/query-bus";

export const USERS_QUERY_TYPE = "example/USERS";

export interface UsersQueryPayload {
  page?: number;
  limit?: number;
  sort?: { [key: string]: "ASC" | "DESC" };
  filter?: any;
}

export class UsersQuery implements Query<UsersQueryPayload> {
  public type: string = USERS_QUERY_TYPE;

  constructor(public payload: UsersQueryPayload) {}
}
