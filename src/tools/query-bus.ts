import { QueryBus as QueryBusBase, Query } from "@tshio/query-bus";
import { RegisteredQueryHandlers } from "../container/query-handlers";

type ResultForQuery<T> = ReturnType<
  Extract<InstanceType<RegisteredQueryHandlers>, { execute: (cmd: T) => any }>["execute"]
>;

export class QueryBus extends QueryBusBase {
  execute<Q extends Query<any>>(query: Q) {
    return super.execute(query) as ResultForQuery<Q>;
  }
}
