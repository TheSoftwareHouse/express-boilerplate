import { CommandHandler } from "../../../../shared/command-bus";
import { {{constantCase name}}_COMMAND_TYPE, {{pascalCase name}}Command } from "../commands/{{kebabCase name}}.command";
import { EventDispatcher } from "../../../../shared/event-dispatcher";
import {{pascalCase name}}Event from "../events/{{kebabCase name}}.event";


export interface {{pascalCase name}}HandlerDependencies {
  eventDispatcher: EventDispatcher;
}

export default class {{pascalCase name}}Handler implements CommandHandler<{{pascalCase name}}Command> {
  public commandType: string = {{constantCase name}}_COMMAND_TYPE;
  
  constructor(private dependencies: {{pascalCase name}}HandlerDependencies) {}

  async execute(command: {{pascalCase name}}Command) {
    // execute body
    await this.dependencies.eventDispatcher.dispatch(new {{pascalCase name}}Event(command))

    return {
      result: command
    }
  };
}
