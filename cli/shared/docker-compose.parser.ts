// import { load, dump } from "js-yaml";
import { readFileSync, writeFileSync } from "fs";

export class DockerComposeParser {
  private document: string[];

  constructor(private path: string) {
    const document = readFileSync(path, "utf8");
    this.document = document.split("\n");
  }

  removeService(serviceKey: string) {
    this.removeSection(serviceKey);
    this.removeDependsOn(serviceKey);
    this.persist();
  }

  private removeSection(serviceKey: string) {
    const serviceIndex = this.document.findIndex((value) => value.includes(`${serviceKey}:`));
    const firstPart = this.document.slice(0, serviceIndex);
    const secondPart = this.document.slice(serviceIndex, this.document.length);

    const endOfServiceSection = secondPart.findIndex((value) => value === "");

    const restFile = secondPart.slice(endOfServiceSection + 1, secondPart.length);

    this.document = [...firstPart, ...restFile];
  }

  private removeDependsOn(serviceKey: string) {
    this.document = this.document.filter((line) => !line.includes(`- ${serviceKey}`));
  }

  private persist() {
    writeFileSync(this.path, this.document.join("\n"));
  }
}
