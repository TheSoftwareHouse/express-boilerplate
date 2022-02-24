import { Query } from "@tshio/query-bus";

export const {{constantCase name}}_DETAILS_QUERY_TYPE = "{{getName module false}}/{{constantCase name}}_DETAILS";

export interface {{pascalCase name}}DetailsQueryPayload {
  id: string;
}

export class {{pascalCase name}}DetailsQuery implements Query<{{pascalCase name}}DetailsQueryPayload> {
  public type: string = {{constantCase name}}_DETAILS_QUERY_TYPE;

  constructor(public payload: {{pascalCase name}}DetailsQueryPayload) {}
}
