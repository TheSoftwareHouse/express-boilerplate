import { Command } from "../../../../shared/command-bus";
import { Event } from "../../../../shared/event-dispatcher/index";
import { {{pascalCase name}}CommandPayload } from "../commands/{{kebabCase name}}.command";

export default class {{pascalCase name}}Event implements Event {
    public name: string = "{{pascalCase name}}";
    public payload: Command<{{pascalCase name}}CommandPayload>;
    
    static get getName() {
        return this.name;
    }

    public constructor(command: Command<{{pascalCase name}}CommandPayload>) {
        this.payload = command;
    }
  }