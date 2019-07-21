// eslint-disable-next-line
import { AwilixContainer } from "awilix";
// eslint-disable-next-line
import { Connection } from "typeorm";

declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

declare global {
  namespace NodeJS {
    interface Global {
      container: AwilixContainer;
      dbConnection: Connection;
    }
  }
}
