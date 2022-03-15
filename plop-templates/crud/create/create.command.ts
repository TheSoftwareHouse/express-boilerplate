import { Command } from "@tshio/command-bus";

export const CREATE_{{constantCase name}}_COMMAND_TYPE = "{{getName module false}}/CREATE_{{constantCase name}}";

export interface Create{{pascalCase name}}CommandPayload {}

export class Create{{pascalCase name}}Command implements Command<Create{{pascalCase name}}CommandPayload> {
  public type: string = CREATE_{{constantCase name}}_COMMAND_TYPE;

  constructor(public payload: Create{{pascalCase name}}CommandPayload) {}
}
