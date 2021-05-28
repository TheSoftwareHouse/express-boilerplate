import { getSecurityClient } from "@tshio/security-client";
import { asClass, asFunction, asValue, AwilixContainer, Lifetime } from "awilix";
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
    authModuleConfig: asValue(authModuleConfig),
    securityClient: asValue(securityClient),
    profileRepository: asValue(getCustomRepository(ProfileTypeormRepository)),
    authTokenHandlerMiddleware: asFunction(authTokenHandlerMiddleware),
  });
};

export const registerRouting = (container: AwilixContainer) => {
  container.loadModules(["src/modules/auth/**/*.action.js"], {
    formatName: "camelCase",
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
      register: asClass,
    },
  });

  container.register({
    authRouting: asFunction(authRouting).singleton(),
    // ROUTING_SETUP
  });

  const { router } = container.cradle;

  router.use("/auth", container.cradle.authRouting);

  return container;
};
