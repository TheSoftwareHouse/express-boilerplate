export interface Configuration {
  name: string;
  dirname: string;
  modules: Module[];
}

export enum Module {
  Redis = "redis",
}
