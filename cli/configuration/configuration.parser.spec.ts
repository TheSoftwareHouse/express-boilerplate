import { expect } from "chai";
import { parseConfiguration } from "./configuration.parser";
import { Configuration, Module } from "./types";

const configuration: Configuration = {
  name: "Unit Test",
  dirname: ".",
  modules: [Module.Redis],
};

describe("Configuration parser", () => {
  it("can parse configuration from 'process.args'", () => {
    const args = ["npx", "ts-node", "index.ts", `--config=${JSON.stringify(configuration)}`];

    const parsedConfig = parseConfiguration(args);

    expect(parsedConfig.name).to.be.equal(configuration.name);
    expect(parsedConfig.dirname).to.be.equal(configuration.dirname);
    expect(parsedConfig.modules).to.be.deep.equal(configuration.modules);
  });

  it("cannot parse configuration if there is missing flag '--config'", () => {
    const args = ["npx", "ts-node", "index.ts"];

    expect(() => parseConfiguration(args)).to.throw();
  });
});
