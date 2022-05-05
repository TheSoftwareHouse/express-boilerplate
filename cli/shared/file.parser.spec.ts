import { expect } from "chai";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { FileParser } from "./file.parser";

const path = join(process.cwd(), "../cli/tests/mock-file.txt");
let tempDocument: string;

describe("File parser", () => {
  beforeEach(() => {
    tempDocument = readFileSync(path, "utf8");
  });

  afterEach(() => {
    writeFileSync(path, tempDocument);
  });

  it("Can remove line from file", () => {
    const file = new FileParser(path);

    file.removeLinesIncludingKey("mock");

    const checkText = "very mocked";

    const checkFile = readFileSync(path, "utf8");
    checkFile.split("\n").forEach((value) => expect(value).not.include(checkText));
    expect(checkFile.split("\n").length).to.be.equal(3);
  });
});
