import { FlushGroupKey } from "./cache-flush-decorator";

function createGroupKeys(handlers: any[]) {
  return handlers.map((handler) => `Queries:${handler.name}:*`);
}

export interface FlushCachedQueriesDependencies {
  handlers: any[];
}

export function FlushCachedQueries({ handlers }: FlushCachedQueriesDependencies) {
  return FlushGroupKey(createGroupKeys(handlers));
}
