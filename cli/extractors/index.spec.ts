import { expect } from "chai";
import { join } from "path";
import { RedisExtractor } from "./redis";
import { Module } from "../configuration/types";
import { getExtractors } from ".";

const dirname = join(process.cwd(), "..");

describe("Module extractors", () => {
  it("returns extractors based on modules in input", () => {
    const extractors = getExtractors(dirname, [Module.Redis]);

    expect(extractors.length).to.be.equal(1);
    expect(extractors.find((extractor) => extractor instanceof RedisExtractor)).to.not.be.undefined;
  });

  it("returns nothing if modules array is empy", () => {
    const extractors = getExtractors(dirname, []);

    expect(extractors.length).to.be.equal(0);
  });
});
