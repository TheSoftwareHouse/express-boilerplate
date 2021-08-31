import { AwilixContainer } from "awilix";

export interface Module {
  new (): Module;
  register: (container: AwilixContainer) => void;
  moduleName: string;
}

export class ModulesLoader {
  static activeModules: Module[] = [];

  constructor(private container: AwilixContainer) {}

  loadModules() {
    ModulesLoader.activeModules.forEach((Module) => {
      new Module().register(this.container);
    });
  }
}
