import { cacheClient } from "../../tools/cache-client";

export function FlushGroupKey(groupKey: string) {
  return function decorator(
    target: Object,
    propertyName: string,
    propertyDesciptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const method = propertyDesciptor.value;
    // eslint-disable-next-line
    propertyDesciptor.value = async function value(...args: any[]) {
      const result = await method.apply(this, args);

      return result;
    };
    return propertyDesciptor;
  };
}
