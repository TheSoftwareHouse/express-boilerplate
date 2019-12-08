import { FlushGroupKey } from "./cache-flush-decorator";

function createGroupKeys(handlers: any[]) {
  return handlers.map(handler => `Queries:${handler.name}:*`);
}

export interface FlushCachedQueriesProps {
  handlers: any[];
}

export function FlushCachedQueries({ handlers }: FlushCachedQueriesProps) {
  return FlushGroupKey(createGroupKeys(handlers));
}
