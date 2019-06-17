import { Handler } from "../../../../shared/command-bus";
import { {{name.capitalSnake}}_COMMAND_TYPE, {{capitalize name.camelCased}}Command } from "../commands/{{name.kebabCased}}.command";

export default class {{capitalize name.camelCased}}Handler implements Handler<{{capitalize name.camelCased}}Command> {

  async execute(command: {{capitalize name.camelCased}}Command) {
    // execute body
  };

  supports(command: {{capitalize name.camelCased}}Command): boolean {
    return command.type === {{name.capitalSnake}}_COMMAND_TYPE;
  };
}
