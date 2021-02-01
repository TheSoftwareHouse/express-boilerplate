import { Command } from "@tshio/command-bus";
import { Event } from "@tshio/event-dispatcher";
import { {{pascalCase name}}CommandPayload } from "../commands/{{kebabCase name}}.command";

export default class {{pascalCase name}}Event implements Event {
    static eventName: string = "{{pascalCase name}}";

    public payload: Command<{{pascalCase name}}CommandPayload>;

    get name() {
        return {{pascalCase name}}Event.eventName;
    }

    public constructor(command: Command<{{pascalCase name}}CommandPayload>) {
        this.payload = command;
    }
  }
