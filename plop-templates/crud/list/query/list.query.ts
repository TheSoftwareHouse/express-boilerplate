import { Query } from "@tshio/query-bus";
import { TypeormMapperDTO } from "../../../../../shared/typeorm/mapper/typeorm-mapper.dto";

export const {{constantCase name}}_LIST_QUERY_TYPE = "{{getName module false}}/{{constantCase name}}_LIST";

export interface {{pascalCase name}}ListQueryPayload {
  typeormMapperDTO: TypeormMapperDTO;
}

export class {{pascalCase name}}ListQuery implements Query<{{pascalCase name}}ListQueryPayload> {
  public type: string = {{constantCase name}}_LIST_QUERY_TYPE;

  constructor(public payload: {{pascalCase name}}ListQueryPayload) {}
}
