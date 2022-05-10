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
    this.removeFiles(["/src/tests/shared/cache-decorator.spec.ts", "/src/tools/cache-client.ts"]);
    this.removeDirs(["/src/shared/cache-decorator"]);
    this.removeLines("cacheClient", ["src/container/common.ts"]);
    this.removeLines("CacheQuery", ["src/app/features/example/query-handlers/users.query.handler.ts"]);
  }

  private removeFiles(paths: string[]) {
    paths.forEach((path) => unlinkSync(join(this.dirname, path)));
  }

  private removeDirs(paths: string[]) {
    paths.forEach((path) =>
      rimraf(join(this.dirname, path), (err) => {
        if (err) throw err;
      }),
    );
  }

  private removeLines(key: string, paths: string[]) {
    paths.forEach((path) => {
      new FileParser(join(this.dirname, path)).removeLinesIncludingKey(key);
    });
  }
}
