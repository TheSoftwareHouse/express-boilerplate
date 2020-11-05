export interface Query<T> {
  type: string;
  payload: T;
}

export interface QueryResult<T> {
  result: T;
}

export interface QueryHandler<TQuery extends Query<unknown>, TResult extends QueryResult<unknown>> {
  queryType: string;
  execute: (query: TQuery) => Promise<TResult>;
}

interface QueryHandlers {
  [key: string]: QueryHandler<any, any>;
}

export class QueryBus {
  private availableHandlers: QueryHandlers;

  constructor(queryHandlers: QueryHandler<any, any>[]) {
    this.availableHandlers = queryHandlers.reduce((handlers: QueryHandlers, handler) => {
      handlers[handler.queryType] = handler;

      return handlers;
    }, {});
  }

  public execute(query: Query<any>): Promise<QueryResult<any>> {
    if (!this.availableHandlers[query.type]) {
      return Promise.reject(new Error(`Query: ${query.type} is not supported.`));
    }

    return this.availableHandlers[query.type].execute(query);
  }
}
