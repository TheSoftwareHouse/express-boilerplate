import { expect } from "chai";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { DockerComposeParser } from "./docker-compose.parser";

let tempDocument: string;
const path = join(process.cwd(), "../docker-compose.yml");

describe("Docker-compose parser", () => {
  beforeEach(() => {
    tempDocument = readFileSync(path, "utf8");
  });
  afterEach(() => {
    writeFileSync(path, tempDocument);
  });
  it("can remove redis service", () => {
    const serviceKey = "redis";
    const parser = new DockerComposeParser(path);

    parser.removeService(serviceKey);

    const compose = readFileSync(path, "utf8");

    compose.split("\n").forEach((value) => expect(value).not.include(serviceKey));
  });
});
