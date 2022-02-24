import { Command } from "@tshio/command-bus";

export const {{constantCase name}}_COMMAND_TYPE = "{{getName module false}}/{{constantCase name}}";

export interface {{pascalCase name}}CommandPayload {}

export class {{pascalCase name}}Command implements Command<{{pascalCase name}}CommandPayload> {
  public type: string = {{constantCase name}}_COMMAND_TYPE;

  constructor(public payload: {{pascalCase name}}CommandPayload) {}
}
