import { AwilixContainer, Lifetime } from "awilix";
import * as awilix from "awilix";
import { authRouting } from "../feature/routing";
import { Router } from "express";

export const registerDependencies = (container: AwilixContainer) => {
  container.register({});
};

export const registerRouting = (container: AwilixContainer) => {
  container.loadModules(["src/modules/auth/**/*.action.js"], {
    formatName: "camelCase",
    resolverOptions: {
      lifetime: Lifetime.SCOPED,
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
