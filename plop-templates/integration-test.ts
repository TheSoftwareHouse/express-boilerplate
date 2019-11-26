import { expect } from "chai";
import "mocha";
import * as request from "supertest";

describe("/api/{{kebabCase name}} integration", () => {
  it("test example", async () => {
    return request(global.container.resolve("app"))
      .get("/health")
      .expect(200)
  });
});
