import { Command } from "@tshio/command-bus";

export const REMOVE_{{constantCase name}}_COMMAND_TYPE = "{{getName module false}}/REMOVE_{{constantCase name}}";

export interface Remove{{pascalCase name}}CommandPayload {
  id: string;
}

export class Remove{{pascalCase name}}Command implements Command<Remove{{pascalCase name}}CommandPayload> {
  public type: string = REMOVE_{{constantCase name}}_COMMAND_TYPE;

  constructor(public payload: Remove{{pascalCase name}}CommandPayload) {}
}
