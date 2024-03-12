import { AwilixContainer, asValue } from "awilix";
import { Logger } from "winston";
import { ContainerDependencies } from "../container";
import { dataSource } from "../config/db";
import { UserEntity } from "../app/features/example/models/user.entity";
// MODELS_IMPORTS

export async function registerDatabase(container: AwilixContainer, dependencies?: ContainerDependencies) {
  await dataSource.initialize();
  const dbDataSource = dependencies?.dbDataSource || dataSource;

  try {
    await dbDataSource.runMigrations();
  } catch (err) {
    (container.cradle.logger as Logger).debug(`Migrations: ${err}`);
    throw err;
  }
  container.register({
    dbDataSource: asValue(dbDataSource),
    userRepository: asValue(dbDataSource.getRepository(UserEntity)),
    // MODELS_SETUP
  });
}
