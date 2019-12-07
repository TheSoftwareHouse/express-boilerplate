import { CacheDecorator } from "./cache-decorator";

function createCacheKey(target: Object, args: any[]) {
  const cacheKey = `Queries:${target.constructor.name}`;
  const arg = args[0];
  return `${cacheKey}:${Object.keys(arg)
    .map(key => arg[key])
    .join("_")}`;
}

export function CacheQuery(duration?: number) {
  return CacheDecorator(createCacheKey, duration);
}
