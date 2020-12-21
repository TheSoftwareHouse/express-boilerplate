import { AwilixContainer } from "awilix";
import { ModulesLoader } from "../modules/modules-loader";

export async function registerModules(container: AwilixContainer) {
  const modulesLoader = new ModulesLoader(container);

  modulesLoader.loadModules();

  return container;
}
