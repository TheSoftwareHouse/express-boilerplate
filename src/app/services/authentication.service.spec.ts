import "mocha";
import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import {
  ADMIN_ID,
  ExternalAuthenticationMock,
} from "../../tools/external-authentication-mock/external-authentication-mock";
import { AuthenticationService } from "./authentication.service";

use(chaiAsPromised);

describe("authentication service", () => {
  it("throws error if no handler found", async () => {
    const externalAuthSecret = "test-external-auth-secret";
    const externalAuthService = new ExternalAuthenticationMock(
      externalAuthSecret,
    );
    const authenticationService = new AuthenticationService({
      accessTokenExpirationTime: "10m",
      accessTokenKey: "test-access-token-key",
      externalAuthSecret,
      externalAuthService,
    });

    await expect(
      authenticationService.login("this-wont-work"),
    ).to.be.rejectedWith("error.authorization");
  });

  it("executes matched handler if found", async () => {
    const externalAuthSecret = "test-external-auth-secret";
    const externalAuthService = new ExternalAuthenticationMock(
      externalAuthSecret,
    );
    const authenticationService = new AuthenticationService({
      accessTokenExpirationTime: "10m",
      accessTokenKey: "test-access-token-key",
      externalAuthSecret,
      externalAuthService,
    });

    const result = await authenticationService.login(ADMIN_ID);
    expect(result.accessToken).to.be.a("string");
  });
});
