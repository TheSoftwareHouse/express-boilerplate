import { readFileSync, writeFileSync } from "fs";

export class FileParser {
  file: string;

  constructor(private path: string) {
    this.file = readFileSync(this.path, "utf-8");
  }

  removeLinesIncludingKey(key: string) {
    this.removeLine(key);
    this.persist();
  }

  private removeLine(key: string) {
    this.file = this.file
      .split("\n")
      .filter((value) => !value.includes(key))
      .join("\n");
  }

  private persist() {
    writeFileSync(this.path, this.file, "utf-8");
  }
}
