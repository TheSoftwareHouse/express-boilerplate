import { OK, UNAUTHORIZED } from "http-status-codes";
import { config as dotenvConfig } from "dotenv";
import { makePercentApiConfig } from "../../../config/services";

export const ADMIN_ID = "85639e7b-3ce5-47bc-b773-1c8756b48c5a";
export const REVIEWER_ID = "c83e8b83-df11-47d2-9018-dbf7e4c59d51";
export const CAUSE_ID = "086dfa8b-2a78-468a-8936-5a027866a8a0";

dotenvConfig();

export interface MockResponse {
  status: number;
  json?: () => Promise<{
    userId: string;
    name: string;
    accessToken: string;
    refreshToken: string;
  }>;
}

const config = makePercentApiConfig(process.env);

export class ExternalAuthenticationMock {
  mockData: { [secret: string]: { [key: string]: any } };

  constructor(externalAuthSecret: string = config.externalAuthSecret) {
    this.mockData = {
      [externalAuthSecret]: {
        [ADMIN_ID]: {
          userId: "4cf9a539-14c3-4f54-b2a2-3d0273587c0e",
          name: "Alan Admin",
          accessToken: "internal user access 1",
          refreshToken: "internal user refresh 1",
        },
        [REVIEWER_ID]: {
          userId: "912ea6fa-fcd0-40af-94d6-00b453c58eaf",
          name: "Richard Reviewer",
          accessToken: "internal user access 2",
          refreshToken: "internal user refresh 2",
        },
        [CAUSE_ID]: {
          userId: "f03960ed-4571-4cae-b71b-b5a28f95e8a6",
          name: "Colin Cause",
          accessToken: "internal user access 3",
          refreshToken: "internal user refresh 3",
        },
      },
    };
  }

  async requestAuthentication(
    secret: string,
    authToken: string,
  ): Promise<MockResponse> {
    const user = this.mockData[secret] && this.mockData[secret][authToken];
    if (user) {
      return {
        status: OK,
        json: () => Promise.resolve(user),
      };
    }

    return {
      status: UNAUTHORIZED,
    };
  }
}
