import { AwilixContainer } from "awilix";
import * as awilix from "awilix";
import { AppConfig } from "../../config/app";
import { winstonLogger } from "../shared/logger";
import { cacheClient } from "../tools/cache-client";
import { createRouter } from "../app/router";
import { QueryBus, CommandBus, EventDispatcher } from "../shared";
import { restrictFromProduction } from "../shared/logger/restrict-from-production";

export async function registerCommonDependencies(appConfig: AppConfig, container: AwilixContainer) {
  container.register({
    restrictFromProduction: awilix.asValue(restrictFromProduction(appConfig.env)),
    port: awilix.asValue(appConfig.port),
    logger: awilix.asValue(winstonLogger),
    cacheClient: awilix.asValue(cacheClient),
    appConfig: awilix.asValue(appConfig),
    router: awilix.asFunction(createRouter),
    queryBus: awilix.asClass(QueryBus).classic().singleton(),
    commandBus: awilix.asClass(CommandBus).classic().singleton(),
    eventDispatcher: awilix.asClass(EventDispatcher).classic().singleton(),
  });

  return container;
}
