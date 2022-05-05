import { unlinkSync } from "fs";
import { join } from "path";
import * as rimraf from "rimraf";
import { DockerComposeParser } from "../shared/docker-compose.parser";
import { FileParser } from "../shared/file.parser";
import { ModuleExtractor } from "./types";

interface RedisExtractorDependecies {
  dockerCompose: DockerComposeParser;
  env: FileParser;
  dirname: string;
}

export class RedisExtractor implements ModuleExtractor {
  dependencyName: string = "redis";

  dockerCompose: DockerComposeParser;

  dirname: string;

  env: FileParser;

  constructor({ dockerCompose, env, dirname }: RedisExtractorDependecies) {
    this.dockerCompose = dockerCompose;
    this.env = env;
    this.dirname = dirname;
  }

  public removeModule() {
    this.dockerCompose.removeService("redis");
    this.env.removeLinesIncludingKey("REDIS_URL");
    this.removeFiles();
    this.removeDirs();
    this.removeLines("cacheClient");
  }

  private removeFiles() {
    const paths = ["/src/tests/shared/cache-decorator.spec.ts", "/src/tools/cache-client.ts"];

    paths.forEach((path) => unlinkSync(join(this.dirname, path)));
  }

  private removeDirs() {
    const paths = ["/src/shared/cache-decorator"];

    paths.forEach((path) =>
      rimraf(join(this.dirname, path), (err) => {
        if (err) throw err;
      }),
    );
  }

  private removeLines(line: string) {
    const paths = ["src/container/common.ts"];

    paths.forEach((path) => {
      new FileParser(join(this.dirname, path)).removeLinesIncludingKey(line);
    });
  }
}
