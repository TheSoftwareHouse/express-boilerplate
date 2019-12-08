import { FlushGroupKey } from "./cache-flush-decorator";

function createGroupKey(queryHandler: any) {
  return `Queries:${queryHandler.name}`;
}

export function FlushQueryCache(queryHandler: any) {
  return FlushGroupKey(createGroupKey(queryHandler));
}
