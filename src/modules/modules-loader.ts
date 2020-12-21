import { AwilixContainer } from "awilix";
import { AuthModule } from "./auth";

export interface Module {
  register: (container: AwilixContainer) => void;
}

export class ModulesLoader {
  static activeModules = [AuthModule];

  constructor(private container: AwilixContainer) {}

  loadModules() {
    ModulesLoader.activeModules.forEach((Module) => {
      new Module().register(this.container);
    });
  }
}
