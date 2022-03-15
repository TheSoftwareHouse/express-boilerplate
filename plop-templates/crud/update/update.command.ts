import { Command } from "@tshio/command-bus";

export const UPDATE_{{constantCase name}}_COMMAND_TYPE = "{{getName module false}}/UPDATE_{{constantCase name}}";

export interface Update{{pascalCase name}}CommandPayload {
  id: string;
}

export class Update{{pascalCase name}}Command implements Command<Update{{pascalCase name}}CommandPayload> {
  public type: string = UPDATE_{{constantCase name}}_COMMAND_TYPE;

  constructor(public payload: Update{{pascalCase name}}CommandPayload) {}
}
