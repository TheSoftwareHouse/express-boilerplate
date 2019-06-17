import { Command } from "../../../../shared/command-bus";

export const {{name.pascalKebab}}_COMMAND_TYPE = '{{getName module}}/{{uppercase name.camelCased}}';

export interface {{capitalize name.camelCased}}CommandPayload {
}

export class {{capitalize name.camelCased}}Command implements Command<{{capitalize name.camelCased}}CommandPayload> {
  constructor(public payload: {{capitalize name}}CommandPayload) {}

  type = {{name.pascalKebab}}_COMMAND_TYPE;
}
