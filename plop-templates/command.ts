import { Command } from "../../../shared/command-bus";

export const {{name.capitalSnake}}_COMMAND_TYPE = '{{getName module}}/{{uppercase name.camelCased}}';

export interface {{capitalize name.camelCased}}CommandPayload {
}

export class {{capitalize name.camelCased}}Command implements Command<{{capitalize name.camelCased}}CommandPayload> {
  public type: string = {{name.capitalSnake}}_COMMAND_TYPE;

  constructor(public payload: {{capitalize name.camelCased}}CommandPayload) {}
}
