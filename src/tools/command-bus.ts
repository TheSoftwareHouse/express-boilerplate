import { CommandBus as CommandBusBase, Command } from "@tshio/command-bus";
import { RegisteredCommandHandlers } from "../container/command-handlers";

type ResultForCommand<T> = ReturnType<
  Extract<InstanceType<RegisteredCommandHandlers>, { execute: (cmd: T) => any }>["execute"]
>;

export class CommandBus extends CommandBusBase {
  execute<Cmd extends Command<any>>(command: Cmd) {
    return super.execute(command) as ResultForCommand<Cmd>;
  }
}
