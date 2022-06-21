import { CommandHandler } from "@tshio/command-bus";
import { Logger } from "@tshio/logger";
import { Repository } from "typeorm";
import { NotFoundError } from "../../../../errors/not-found.error";
import { UPDATE_{{constantCase name}}_COMMAND_TYPE, Update{{pascalCase name}}Command } from "../commands/update-{{kebabCase name}}.command";
import { {{pascalCase name}}Entity } from "../models/{{kebabCase name}}.entity";

export interface Update{{pascalCase name}}HandlerDependencies {
  logger: Logger;
  {{camelCase name}}Repository: Repository<{{pascalCase name}}Entity>;
}

export default class Update{{pascalCase name}}Handler implements CommandHandler<Update{{pascalCase name}}Command> {
  public commandType: string = UPDATE_{{constantCase name}}_COMMAND_TYPE;

  constructor(private dependencies: Update{{pascalCase name}}HandlerDependencies) {}

  async execute(command: Update{{pascalCase name}}Command) {
    let {{camelCase name}}Entity = await this.dependencies.{{camelCase name}}Repository.findOneBy({
      id: command.payload.id,
    });

    if (!{{camelCase name}}Entity) {
      throw new NotFoundError("{{camelCase name}} not found");
    }
    {{camelCase name}}Entity = await this.dependencies.{{camelCase name}}Repository.save({ ...{{camelCase name}}Entity, ...command.payload });

    return {
      result: {{camelCase name}}Entity,
    };
  }
}
