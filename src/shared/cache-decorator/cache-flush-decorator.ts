import { cacheClient } from "../../tools/cache-client";

export function FlushGroupKey(groupKeys: string[]) {
  return function decorator(
    target: Object,
    propertyName: string,
    propertyDesciptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const method = propertyDesciptor.value;
    // eslint-disable-next-line
    propertyDesciptor.value = async function value(...args: any[]) {
      await Promise.all(groupKeys.map((groupKey) => cacheClient.removeByPattern(groupKey)));

      const result = await method.apply(this, args);

      return result;
    };
    return propertyDesciptor;
  };
}
