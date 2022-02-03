export type SpiedFn<T extends Function> = T & { calledWith: any };
export type SpiedObject<T extends object> = { [K in keyof T]: T[K] extends Function ? SpiedFn<T[K]> : T[K] };

export const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
