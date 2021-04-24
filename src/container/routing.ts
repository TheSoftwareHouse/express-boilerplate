import { AwilixContainer, Lifetime, asClass, asFunction } from "awilix";
import { usersRouting } from "../app/features/example/routing";
// ROUTING_IMPORTS

export async function registerRouting(container: AwilixContainer) {
  container.loadModules(["src/app/**/*.action.js"], {
    formatName: "camelCase",
    resolverOptions: {
      lifetime: Lifetime.SCOPED,
      register: asClass,
    },
  });

  container.register({
    usersRouting: asFunction(usersRouting),
    // ROUTING_SETUP
  });

  return container;
}
