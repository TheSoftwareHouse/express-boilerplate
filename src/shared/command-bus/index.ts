export interface Command<T> {
  type: string;
  payload: T;
}

export interface Handler<T extends Command<any> = Command<any>> {
  supports: (command: T) => boolean;
  execute: (command: T) => Promise<any>;
}

export class CommandBus {
  constructor(private handlers: Handler[]) {}

  public execute(command: any) {
    const matchedHandler = this.handlers.find(handler =>
      handler.supports(command),
    );

    if (!matchedHandler) {
      return Promise.reject(
        new Error(`Command: ${command.type} is not supported.`),
      );
    }

    return matchedHandler.execute(command);
  }
}
