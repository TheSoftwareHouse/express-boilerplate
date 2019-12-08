/* eslint-disable max-classes-per-file */
import "chai";
import { expect } from "chai";
import { CacheClient } from "../../src/tools/cache-client";
import { CacheQuery } from "../../src/shared/cache-decorator";
import { QueryHandler, CommandHandler } from "../../src/shared";
import { FlushCachedQueries } from "../../src/shared/cache-decorator/flush-query-cache-decorator";

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

  @CacheQuery({ duration: 2 })
  public async execute(query: CacheExampleQuery) {
    return {
      id: query.id,
      number: Math.random(),
    };
  }
}

class CacheExampleCommandHandler implements CommandHandler<any> {
  commandType = "example-command";

  @FlushCachedQueries({ handlers: [CacheExampleQueryHandler] })
  async execute() {
    return {};
  }
}

describe("Cache Decorator", () => {
  afterEach(async () => {
    const redisClient: CacheClient = global.container.resolve("cacheClient");
    await redisClient.removeByPattern("Queries*");
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

  it("remove cached query when command with flush cached queries decorator is executed", async () => {
    const exampleCommandHandler = new CacheExampleCommandHandler();
    const exampleClass = new CacheExampleQueryHandler();
    const result = await exampleClass.execute({ id: 1 });
    await exampleCommandHandler.execute();

    const secondResult = await exampleClass.execute({ id: 1 });

    expect(result.number).not.equal(secondResult.number);
  });

  describe("scan method", () => {
    it("return all cached queries", async () => {
      const exampleClass = new CacheExampleQueryHandler();
      await exampleClass.execute({ id: 1 });
      await exampleClass.execute({ id: 2 });
      await exampleClass.execute({ id: 3 });
      await exampleClass.execute({ id: 4 });
      // await exampleCommandHandler.execute();
      const redisClient: CacheClient = global.container.resolve("cacheClient");
      const scanned = await redisClient.scanByPattern("Queries*");
      expect(scanned).to.length(4);
    });

    it("not return cached queries when command with flush cached queries decorator is executed", async () => {
      const exampleCommandHandler = new CacheExampleCommandHandler();
      const exampleClass = new CacheExampleQueryHandler();
      await exampleClass.execute({ id: 1 });
      await exampleClass.execute({ id: 2 });
      await exampleClass.execute({ id: 3 });
      await exampleClass.execute({ id: 4 });

      await exampleCommandHandler.execute();

      // await exampleCommandHandler.execute();
      const redisClient: CacheClient = global.container.resolve("cacheClient");
      const scanned = await redisClient.scanByPattern("Queries*");
      expect(scanned).to.length(0);
    });
  });
});
