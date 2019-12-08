export interface Command<T> {
  type: string;
  payload: T;
}

export interface CommandHandler<T extends Command<any> = Command<any>> {
  commandType: string;
  execute: (command: T) => Promise<any>;
}

interface CommandHandlers {
  [key: string]: CommandHandler;
}

export class CommandBus {
  private availableHandlers: CommandHandlers;

  constructor(commandHandlers: CommandHandler[]) {
    this.availableHandlers = commandHandlers.reduce((handlers: CommandHandlers, handler) => {
      handlers[handler.commandType] = handler;
      return handlers;
    }, {});
  }

  public execute(command: any) {
    if (!this.availableHandlers[command.type]) {
      return Promise.reject(new Error(`Command: ${command.type} is not supported.`));
    }

    return this.availableHandlers[command.type].execute(command);
  }
}
