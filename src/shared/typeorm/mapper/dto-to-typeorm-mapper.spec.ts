import { expect } from "chai";
import { dtoToTypeormMapper } from "./dto-to-typeorm-mapper";

describe("dtoToTypeormMapper units", () => {
  it("should create typeorm mapper object with skip & take", async () => {
    const req: any = {};
    req.query = {
      page: 2,
      limit: 10,
    };

    const result = dtoToTypeormMapper(req);

    expect(result).to.deep.equal({
      skip: 10,
      take: 10,
    });
  });

  it("should create typeorm mapper object with order", async () => {
    const req: any = {};
    req.query = {
      sort: {
        firstName: "ASC",
        lastName: "DESC",
        wrong: "xyz",
      },
    };
    const result = dtoToTypeormMapper(req);
    expect(result).to.deep.equal({
      order: {
        firstName: "ASC",
        lastName: "DESC",
      },
    });
  });

  it("should create typeorm mapper object with filter", async () => {
    const req: any = {};

    req.query = {
      filter: {
        name: {
          in: "a,b,c",
        },
      },
    };

    const result = dtoToTypeormMapper(req);

    expect(result).to.deep.equal({
      where: {
        where: "name IN (:...0)",
        operands: { "0": ["a", "b", "c"] },
      },
    });
  });
});
