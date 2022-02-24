import { Query } from "@tshio/query-bus";

export const {{constantCase name}}_QUERY_TYPE = "{{getName module false}}/{{constantCase name}}";

export interface {{pascalCase name}}QueryPayload {}

export class {{pascalCase name}}Query implements Query<{{pascalCase name}}QueryPayload> {
  public type: string = {{constantCase name}}_QUERY_TYPE;

  constructor(public payload: {{pascalCase name}}QueryPayload) {}
}
