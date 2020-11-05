import "mocha";
import { expect } from "chai";
import { makePaginationMeta, normalizePage } from "./pagination-meta";

describe("pagination-meta", () => {
  it("returns valid pagination", async () => {
    const result = makePaginationMeta(4, 2, 10);
    expect(result).to.include.deep.equal({
      page: 2,
      size: 4,
      total: 10,
      totalPages: 3,
    });
  });

  it("returns valid pagination if size is 0", async () => {
    const result = makePaginationMeta(0, 2, 10);
    expect(result).to.include.deep.equal({
      page: 2,
      size: 0,
      total: 10,
      totalPages: 10,
    });
  });

  it("returns first page if passed 0 page", async () => {
    const result = makePaginationMeta(5, 2, 10);
    expect(result).to.include.deep.equal({
      page: 2,
      size: 5,
      total: 10,
      totalPages: 2,
    });
  });
});

describe("normalizePage", () => {
  it("returns page reduced by 1", () => {
    const result = normalizePage(2);
    expect(result).to.equal(1);
  });

  it("returns 0 for lower values", () => {
    const result = normalizePage(0);
    expect(result).to.equal(0);
  });
});
