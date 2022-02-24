import { CommandHandler } from "@tshio/command-bus";
import { Logger } from "@tshio/logger";
import { Repository } from "typeorm";
import { NotFoundError } from "../../../../errors/not-found.error";
import { UPDATE_{{constantCase name}}_COMMAND_TYPE, Update{{pascalCase name}}Command } from "../commands/update-{{kebabCase name}}.command";
import { {{pascalCase name}}Model } from "../models/{{kebabCase name}}.model";

export interface Update{{pascalCase name}}HandlerDependencies {
  logger: Logger;
  {{camelCase name}}Repository: Repository<{{pascalCase name}}Model>;
}

export default class Update{{pascalCase name}}Handler implements CommandHandler<Update{{pascalCase name}}Command> {
  public commandType: string = UPDATE_{{constantCase name}}_COMMAND_TYPE;

  constructor(private dependencies: Update{{pascalCase name}}HandlerDependencies) {}

  async execute(command: Update{{pascalCase name}}Command) {
    let {{camelCase name}}Model = await this.dependencies.{{camelCase name}}Repository.findOne(command.payload.id);

    if (!{{camelCase name}}Model) {
      throw new NotFoundError("{{camelCase name}} not found");
    }
    {{camelCase name}}Model = await this.dependencies.{{camelCase name}}Repository.save({ ...{{camelCase name}}Model, ...command.payload });

    return {
      result: {{camelCase name}}Model,
    };
  }
}
