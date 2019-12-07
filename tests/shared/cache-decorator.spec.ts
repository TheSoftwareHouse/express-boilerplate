import "chai";
import { expect } from "chai";
import { CacheClient } from "../../src/tools/cache-client";
import { CacheQuery } from "../../src/shared/cache-decorator";
import { QueryHandler } from "../../src/shared";

interface CacheExampleQuery {
  id: number;
}

class CacheExampleQueryHandler implements QueryHandler<any, any> {
  queryType = "example-query";

  @CacheQuery()
  public async execute(query: CacheExampleQuery) {
    return {
      id: query.id,
      number: Math.random(),
    };
  }
}

describe("Cache Decorator", () => {
  afterEach(() => {
    const redisClient: CacheClient = global.container.resolve("cacheClient");
    redisClient.flushAll();
  });

  it("return cached method result", async () => {
    const exampleClass = new CacheExampleQueryHandler();
    const result = await exampleClass.execute({ id: 1 });
    const cachedResult = await exampleClass.execute({ id: 1 });

    expect(result.number).equal(cachedResult.number);
  });

  it("cache two times if parameters are different", async () => {
    const exampleClass = new CacheExampleQueryHandler();
    const result = await exampleClass.execute({ id: 1 });
    const secondResult = await exampleClass.execute({ id: 2 });

    expect(result.number).not.equal(secondResult.number);
  });
});
