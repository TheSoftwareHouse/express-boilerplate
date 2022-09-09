import { CommandHandler } from "@tshio/command-bus";
import { Logger } from "@tshio/logger";
import { Repository } from "typeorm";
import { NotFoundError } from "../../../../errors/not-found.error";
import { REMOVE_{{constantCase name}}_COMMAND_TYPE, Remove{{pascalCase name}}Command } from "../commands/remove-{{kebabCase name}}.command";
import { {{pascalCase name}}Entity } from "../models/{{kebabCase name}}.entity";

export interface Remove{{pascalCase name}}HandlerDependencies {
  logger: Logger;
  {{camelCase name}}Repository: Repository<{{pascalCase name}}Entity>;
}

export default class Remove{{pascalCase name}}Handler implements CommandHandler<Remove{{pascalCase name}}Command> {
  public commandType: string = REMOVE_{{constantCase name}}_COMMAND_TYPE;

  constructor(private dependencies: Remove{{pascalCase name}}HandlerDependencies) {}

  async execute(command: Remove{{pascalCase name}}Command) {
    const {{camelCase name}}Entity = await this.dependencies.{{camelCase name}}Repository.findOneBy({
      id: command.payload.id,
    });

    if (!{{camelCase name}}Entity) {
      throw new NotFoundError("{{camelCase name}} not found");
    }
    await this.dependencies.{{camelCase name}}Repository.remove({{camelCase name}}Entity);

    return {
      result: {
        status: true,
      },
    };
  }
}
