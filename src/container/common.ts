import { AwilixContainer } from "awilix";
import * as awilix from "awilix";
import { QueryBus } from "@tshio/query-bus";
import { CommandBus } from "@tshio/command-bus";
import { EventDispatcher } from "@tshio/event-dispatcher";
import { createLogger, restrictFromProduction } from "@tshio/logger";
import { AppConfig } from "../../config/app";
import { cacheClient } from "../tools/cache-client";
import { createRouter } from "../app/router";

export async function registerCommonDependencies(appConfig: AppConfig, container: AwilixContainer) {
  container.register({
    restrictFromProduction: awilix.asValue(restrictFromProduction(appConfig.env)),
    port: awilix.asValue(appConfig.port),
    logger: awilix.asValue(createLogger(process.env, ["accessToken", "refreshToken"])),
    cacheClient: awilix.asValue(cacheClient),
    appConfig: awilix.asValue(appConfig),
    router: awilix.asFunction(createRouter).singleton(),
    queryBus: awilix.asClass(QueryBus).classic().singleton(),
    commandBus: awilix.asClass(CommandBus).classic().singleton(),
    eventDispatcher: awilix.asClass(EventDispatcher).classic().singleton(),
  });

  return container;
}
