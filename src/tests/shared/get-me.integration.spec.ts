import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { expect } from "chai";
import { dataSource } from "../../config/db";
import { UserEntity } from "../../app/features/example/models/user.entity";

describe("GET /api/example/me", () => {
  const authToken = "Bearer example.token";
  const userRepository = dataSource.getRepository(UserEntity);

  it("should return proper profile data", async () => {
    const expectedUserEntity = await userRepository.save({
      firstName: "Test",
      lastName: "Integration",
      email: "test@integration.com",
    });

    await request(await global.container.cradle.app)
      .get("/api/example/me")
      .set("Authorization", authToken)
      .expect(StatusCodes.OK)
      .expect((response) => {
        expect(response.body).to.deep.equal(expectedUserEntity);
      });
  });

  it("should return Not Found if there is no such user in database", async () => {
    await request(await global.container.cradle.app)
      .get("/api/example/me")
      .set("Authorization", authToken)
      .expect(StatusCodes.NOT_FOUND);
  });
});
