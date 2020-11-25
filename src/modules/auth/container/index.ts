import { getSecurityClient } from "@tshio/security-client";
import { AwilixContainer, Lifetime } from "awilix";
import * as awilix from "awilix";
import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { authRouting } from "../feature/routing";
import { ProfileTypeormRepository } from "../feature/repositories/typeorm/profile.typeorm.repository";
import { authModuleConfigFactory } from "../config/auth";
import { authTokenHandlerMiddleware } from "../midlleware/access-token-handler";

export const registerDependencies = (container: AwilixContainer) => {
  const authModuleConfig = authModuleConfigFactory(process.env);
  const securityClient = getSecurityClient({
    host: authModuleConfig.host,
    port: authModuleConfig.port,
  });

  container.register({
    authModuleConfig: awilix.asValue(authModuleConfig),
    securityClient: awilix.asValue(securityClient),
    profileRepository: awilix.asValue(getCustomRepository(ProfileTypeormRepository)),
    // authTokenHandlerMiddleware: awilix.asValue(authTokenHandlerMiddleware({securityClient})),
    authTokenHandlerMiddleware: awilix.asFunction(authTokenHandlerMiddleware),
    // authTokenHandlerMiddleware: awilix.asFunction(authTokenHandlerMiddleware).singleton(),
  });
};

export const registerRouting = (container: AwilixContainer) => {
  container.loadModules(["src/modules/auth/**/*.action.js"], {
    formatName: "camelCase",
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
      register: awilix.asClass,
    },
  });

  container.register({
    authRouting: awilix.asFunction(authRouting).singleton(),
    // ROUTING_SETUP
  });

  const router: Router = container.resolve("router");

  router.use("/auth", <any>container.resolve("authRouting"));

  return container;
};
