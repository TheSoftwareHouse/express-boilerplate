import { OK } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import { ExternalAuthenticationMock } from "../../tools/external-authentication-mock/external-authentication-mock";
import { HttpError } from "../../errors/http.error";

export interface AuthenticationServiceProps {
  externalAuthSecret: string;
  accessTokenKey: string;
  accessTokenExpirationTime: string;
  externalAuthService: ExternalAuthenticationMock;
}

export class AuthenticationService {
  private readonly externalAuthSecret: string;

  private readonly accessTokenKey: string;

  private readonly accessTokenExpirationTime: string;

  private readonly externalAuthService: ExternalAuthenticationMock;

  constructor({
    externalAuthSecret,
    accessTokenKey,
    accessTokenExpirationTime,
    externalAuthService,
  }: AuthenticationServiceProps) {
    this.externalAuthSecret = externalAuthSecret;
    this.accessTokenKey = accessTokenKey;
    this.accessTokenExpirationTime = accessTokenExpirationTime;
    this.externalAuthService = externalAuthService;
  }

  async login(authToken: string): Promise<{ accessToken: string }> {
    const requestResult = await this.externalAuthService.requestAuthentication(
      this.externalAuthSecret,
      authToken,
    );
    if (requestResult.status === OK && requestResult.json) {
      const result = await requestResult.json();
      const token = jwt.sign(
        {
          userId: result.userId,
          name: result.name,
        },
        this.accessTokenKey,
        {
          expiresIn: this.accessTokenExpirationTime,
        },
      );

      return {
        accessToken: token,
      };
    }
    throw new HttpError("error.authorization", requestResult.status);
  }
}
