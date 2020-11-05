/* eslint-disable max-classes-per-file */
import { expect } from "chai";
import { Query, QueryBus, QueryHandler, QueryResult } from ".";

const QUERY_TYPE = "query-type";

class TestQueryResult implements QueryResult<string> {
  result: string;

  constructor(payload: string) {
    this.result = payload;
  }
}

class TestQueryHandler implements QueryHandler<Query<string>, QueryResult<string>> {
  public queryType: string = QUERY_TYPE;

  public execute(query: Query<string>): Promise<QueryResult<string>> {
    return Promise.resolve(new TestQueryResult(query.payload));
  }
}

describe("query bus", () => {
  it("throws error if no handler found", async () => {
    const bus = new QueryBus([]);

    const testQuery: Query<string> = {
      payload: "payload-data",
      type: "query-type",
    };

    await expect(bus.execute(testQuery)).to.be.rejectedWith("Query: query-type is not supported.");
  });

  it("executes matched handler if found", async () => {
    const bus = new QueryBus([new TestQueryHandler()]);

    const query: Query<string> = {
      payload: "test",
      type: "query-type",
    };

    expect(await bus.execute(query)).to.be.deep.equal({ result: "test" });
  });
});
