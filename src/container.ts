import * as awilix from "awilix";
import { AwilixContainer } from "awilix";
import { Application } from "express";
import * as http from "http";
import { Connection } from "typeorm";
import { createApp } from "./app/app";
import { appConfigFactory, AppConfig } from "../config/app";

import { registerCommonDependencies } from "./container/common";
import { registerDatabase } from "./container/database";
import { loadEnvs } from "../config/env";
import { registerMiddlewares } from "./container/middlewares";
import { registerQueryHandlers } from "./container/query-handlers";
import { registerCommandHandlers } from "./container/command-handlers";
import { registerRouting } from "./container/routing";
import { registerSubscribers } from "./container/subscribers";
import { registerGraphQLDependencies } from "./container/graphql";

loadEnvs();

export interface ContainerDependencies {
  connection?: Connection;
  appConfig?: AppConfig;
}

export async function createContainer(dependencies?: ContainerDependencies): Promise<AwilixContainer> {
  const appConfig = dependencies?.appConfig ? dependencies.appConfig : appConfigFactory(process.env);
  
  const container: AwilixContainer = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
  });

  await registerCommonDependencies(appConfig, container);
  await registerDatabase(container, dependencies);
  await registerMiddlewares(container);
  await registerQueryHandlers(container);
  await registerCommandHandlers(container);
  await registerRouting(container);
  await registerGraphQLDependencies(container);
  await registerSubscribers(container);

  container.register({
    app: awilix.asFunction(createApp).singleton(),
  });

  const app: Application = container.resolve("app");

  container.register({
    server: awilix.asValue(http.createServer(app)),
  });

  return container;
}
