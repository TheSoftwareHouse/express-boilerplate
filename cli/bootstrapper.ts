import { Cleaner } from "./cleaner";
import { getExtractors } from "./extractors";
import { ModuleExtractor } from "./extractors/types";
import { Configuration, Module } from "./configuration/types";

export class Bootstrapper {
  private cleaner: Cleaner;

  private extractors: ModuleExtractor[];

  constructor(configuration: Configuration) {
    const allModules = Object.values(Module);
    const modulesToExtract = allModules.filter((module) => !configuration.modules.includes(module));
    this.extractors = getExtractors(configuration.dirname, modulesToExtract);

    const packageNames = this.extractors.map((extractor) => extractor.dependencyName);
    this.cleaner = new Cleaner({ dirname: configuration.dirname, packageNames });
  }

  execute() {
    this.extractors.forEach((extractor) => extractor.removeModule());
    this.cleaner.cleanUp();
  }
}
