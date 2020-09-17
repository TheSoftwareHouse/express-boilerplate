import { AwilixContainer, Resolver } from "awilix";

export function asDictionary<T>(dictionary: { [key: string]: Resolver<T> }) {
  return {
    resolve: (container: AwilixContainer) => {
      const newDictionary: { [key: string]: any } = {};
      Object.entries(dictionary).forEach(([key, value]) => {
        newDictionary[key] = container.build(value);
      });
      return newDictionary;
    },
  };
}

export function asArray<T>(resolvers: Resolver<T>[]): Resolver<T[]> {
  return {
    resolve: (container: AwilixContainer) => resolvers.map((r: Resolver<T>) => container.build(r)),
  };
}
