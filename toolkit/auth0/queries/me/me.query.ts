import { Query } from "@tshio/query-bus";

export const ME_QUERY_TYPE = "example/ME";

export interface MeQueryPayload {
  email: string;
}

export class MeQuery implements Query<MeQueryPayload> {
  public type: string = ME_QUERY_TYPE;

  constructor(public payload: MeQueryPayload) {}
}
