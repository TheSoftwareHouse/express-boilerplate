import { join } from "path";
import * as rimraf from "rimraf";
import { removeDependencies } from "./shared/npm";

interface CleanerDependencies {
  dirname: string;
  packageNames: string[];
}

export class Cleaner {
  private dirname: string;

  private packageNames: string[];

  constructor({ dirname, packageNames }: CleanerDependencies) {
    this.dirname = dirname;
    this.packageNames = packageNames;
  }

  cleanUp() {
    this.removeDirs();
    removeDependencies(this.dirname, this.packageNames);
  }

  removeDirs() {
    const paths = ["/cli"];

    paths.forEach((path) =>
      rimraf(join(this.dirname, path), (err) => {
        if (err) throw err;
      }),
    );
  }
}
