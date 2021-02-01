import { AwilixContainer } from "awilix";
import { Module } from "../modules-loader";
import { registerDependencies, registerRouting } from "./container";

export class AuthModule implements Module {
  static moduleName: string = "auth";

  register(container: AwilixContainer) {
    registerDependencies(container);
    registerRouting(container);
  }
}
