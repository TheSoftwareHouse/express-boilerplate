import { CommandHandler } from "../../../../shared/command-bus";
import { {{constantCase name}}_COMMAND_TYPE, {{pascalCase name}}Command } from "../commands/{{kebabCase name}}.command";

export default class {{pascalCase name}}Handler implements CommandHandler<{{pascalCase name}}Command> {
  public commandType: string = {{constantCase name}}_COMMAND_TYPE;
  
  async execute(command: {{pascalCase name}}Command) {
    // execute body
    return {
      result: command
    }
  };
}
