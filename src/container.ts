import { asFunction, asValue, AwilixContainer, createContainer as createAwilixContainer, InjectionMode } from "awilix";
import * as http from "http";
import { Connection } from "typeorm";
import { createApp } from "./app/app";
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
import { registerModules } from "./container/modules";

loadEnvs();

export interface ContainerDependencies {
  connection?: Connection;
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
  await registerModules(container);

  container.register({
    app: asFunction(createApp).singleton(),
  });

  const { app } = container.cradle;

  container.register({
    server: asValue(http.createServer(app)),
  });

  return container;
}
