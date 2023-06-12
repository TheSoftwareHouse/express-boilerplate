import { AwilixContainer, createContainer as createAwilixContainer, InjectionMode } from "awilix";
import { DataSource } from "typeorm";
import { AppConfig, appConfigFactory } from "./config/app";
import { registerCommonDependencies } from "./container/common";
import { registerDatabase } from "./container/database";
import { loadEnvs } from "./config/env";
import { registerMiddlewares } from "./container/middlewares";
import { registerQueryHandlers } from "./container/query-handlers";
import { registerCommandHandlers } from "./container/command-handlers";
import { registerRouting } from "./container/routing";
import { registerSubscribers } from "./container/subscribers";
import { registerGraphQLDependencies } from "./container/graphql";

loadEnvs();

export interface ContainerDependencies {
  dbDataSource?: DataSource;
  appConfig?: AppConfig;
}

export async function createContainer(dependencies?: ContainerDependencies): Promise<AwilixContainer> {
  const appConfig = dependencies?.appConfig ? dependencies.appConfig : appConfigFactory(process.env);

  const container: AwilixContainer = createAwilixContainer({
    injectionMode: InjectionMode.PROXY,
  });

  await registerCommonDependencies(appConfig, container);
  await registerMiddlewares(container);
  await registerQueryHandlers(container);
  await registerCommandHandlers(container);
  await registerRouting(container);
  await registerGraphQLDependencies(container);
  await registerSubscribers(container);
  await registerDatabase(container, dependencies);

  return container;
}
