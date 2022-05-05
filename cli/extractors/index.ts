import { join } from "path";
import { FileParser } from "../shared/file.parser";
import { RedisExtractor } from "./redis";
import { Module } from "../configuration/types";
import { DockerComposeParser } from "../shared/docker-compose.parser";
import { ModuleExtractor } from "./types";

export const getExtractors = (dirname: string, modules: Module[]): ModuleExtractor[] => {
  const dockerCompose = new DockerComposeParser(join(dirname, "./docker-compose.yml"));
  const env = new FileParser(join(dirname, "./.env.dist"));

  const extractorMap = {
    [Module.Redis]: new RedisExtractor({ dockerCompose, env, dirname }),
  };

  return modules.map((module) => extractorMap[module]);
};
