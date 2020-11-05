import { AwilixContainer, GlobWithOptions } from "awilix";
import { LoadModulesOptions } from "awilix/lib/load-modules";

export interface MockContainerDependencies {
  config: { [key: string]: any };
  realContainer: AwilixContainer;
}

export class MockContainer implements AwilixContainer {
  options: any;

  cradle: any;

  registrations: any;

  cache: any;

  createScope: () => AwilixContainer;

  inspect: (depth: number, opts?: any) => string;

  register: (name: any, registration?: any) => any;

  has: (name: string | symbol) => boolean;

  dispose: () => Promise<void>;

  build: any;

  loadModules: (globPatterns: Array<string | GlobWithOptions>, options?: LoadModulesOptions) => any;

  config: { [key: string]: any };

  realContainer: AwilixContainer;

  constructor({ config, realContainer }: MockContainerDependencies) {
    this.config = config;
    this.realContainer = realContainer;

    this.options = this.realContainer.options;
    this.cradle = this.realContainer.cradle;
    this.registrations = this.realContainer.registrations;
    this.cache = this.realContainer.cache;
    this.dispose = this.realContainer.dispose.bind(realContainer);
    this.has = this.realContainer.has.bind(realContainer);
    this.register = this.realContainer.register.bind(realContainer);
    this.inspect = this.realContainer.inspect.bind(realContainer);
    this.createScope = this.realContainer.createScope.bind(realContainer);
    this.build = this.realContainer.build.bind(realContainer);
    this.loadModules = this.realContainer.loadModules.bind(realContainer);
  }

  resolve(key: string): any {
    return this.config[key] || this.realContainer.resolve(key);
  }
}
