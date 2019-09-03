export interface Command<T> {
  type: string;
  payload: T;
}

export interface Handler<T extends Command<any> = Command<any>> {
  commandType: string;
  execute: (command: T) => Promise<any>;
}

interface CommandHandlers {
  [key: string]: Handler;
}

export class CommandBus {
  private availableHandlers: CommandHandlers;

  constructor(handlers: Handler[]) {
    this.availableHandlers = handlers.reduce((result: CommandHandlers, handler) => {
      // eslint-disable-next-line
      result[handler.commandType] = handler;
      return result;
    }, {});
  }

  public execute(command: any) {
    if (!this.availableHandlers[command.type]) {
      return Promise.reject(new Error(`Command: ${command.type} is not supported.`));
    }

    return this.availableHandlers[command.type].execute(command);
  }
}
