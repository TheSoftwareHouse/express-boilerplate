import { CommandHandler } from "@tshio/command-bus";
import { Logger } from "@tshio/logger";
import { {{constantCase name}}_COMMAND_TYPE, {{pascalCase name}}Command } from "../commands/{{kebabCase name}}.command";

export interface {{pascalCase name}}HandlerDependencies {
  logger: Logger;
}

export default class {{pascalCase name}}Handler implements CommandHandler<{{pascalCase name}}Command> {
  public commandType: string = {{constantCase name}}_COMMAND_TYPE;

  constructor(private dependencies: {{pascalCase name}}HandlerDependencies) {}

  async execute(command: {{pascalCase name}}Command) {
    // execute body
    this.dependencies.logger.info("Command {{pascalCase name}} executed");

    return {
      result: command,
    };
  }
}
