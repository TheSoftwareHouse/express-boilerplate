import { cacheClient } from "../../tools/cache-client";

export function CacheDecorator(cacheKeyFactory: (target: Object, args: any[]) => string, duration?: number) {
  return function decorator(
    target: Object,
    propertyName: string,
    propertyDesciptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const method = propertyDesciptor.value;
    propertyDesciptor.value = async function value(...args: any[]) {
      const cacheKey = cacheKeyFactory(target, args);
      const cacheResult = await cacheClient.get(cacheKey);
      if (cacheResult) return cacheResult;

      const result = await method.apply(this, args);

      await cacheClient.set(cacheKey, result, duration);

      return result;
    };
    return propertyDesciptor;
  };
}
