import { AwilixContainer } from "awilix";
import { DataSource } from "typeorm";

declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

declare global {
  namespace NodeJS {
    interface Global {
      container: AwilixContainer;
      dbConnection: DataSource;
    }
  }

  var container: AwilixContainer;
  var dbConnection: DataSource;
}
