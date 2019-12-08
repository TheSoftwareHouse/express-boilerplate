import "chai";
import { expect } from "chai";
import { CacheClient } from "../../src/tools/cache-client";
import { CacheQuery } from "../../src/shared/cache-decorator";
import { QueryHandler } from "../../src/shared";
import { FlushQueryCache } from "../../src/shared/cache-decorator/flush-query-cache-decorator";

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

class CacheExampleWithTTLQueryHandler implements QueryHandler<any, any> {
  queryType = "example-query";

  @CacheQuery(2)
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

  it("return cached query result", async () => {
    const exampleClass = new CacheExampleQueryHandler();
    const result = await exampleClass.execute({ id: 1 });
    const cachedResult = await exampleClass.execute({ id: 1 });

    expect(result.number).equal(cachedResult.number);
  });

  it("not return cached data for the same query with different params", async () => {
    const exampleClass = new CacheExampleQueryHandler();
    const result = await exampleClass.execute({ id: 1 });
    const secondResult = await exampleClass.execute({ id: 2 });

    expect(result.number).not.equal(secondResult.number);
  });

  it("return cached query result for cache decorator with TTL", async () => {
    const exampleClass = new CacheExampleWithTTLQueryHandler();
    const result = await exampleClass.execute({ id: 1 });
    const cachedResult = await exampleClass.execute({ id: 1 });

    expect(result.number).equal(cachedResult.number);
  });

  it.only("tests", async () => {
    class Test {
      @FlushQueryCache(CacheExampleQueryHandler)
      execute() {}
    }

    const test = new Test();
    const exampleClass = new CacheExampleQueryHandler();
    const result = await exampleClass.execute({ id: 1 });
    test.execute();

    const secondResult = await exampleClass.execute({ id: 1 });

    expect(result.number).not.equal(secondResult.number);
  });
});
