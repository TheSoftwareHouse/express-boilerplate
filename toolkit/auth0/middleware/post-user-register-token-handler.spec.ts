import sinon from "sinon";
import { env } from "process";
import { postUserRegisterTokenHandler } from "./post-user-register-token-handler";
import { Translation } from "../shared/translation/translation";
import { ErrorCode } from "../shared/constants/error-code.enum";

const jsonFuncStub = sinon.stub();

const res: any = {
  status: () => res,
  json: jsonFuncStub,
};

const stubConfig = {
  logger: {
    error: sinon.stub(),
  },
  appConfig: {
    postUserRegisterToken: env.POST_USER_REGISTER_TOKEN,
  },
} as any;

const next = sinon.stub();

describe("Post user register token handler", () => {
  beforeEach(() => {
    sinon.reset();
  });

  it("should return unauthorized if token does not exist in header", async () => {
    const req: any = {
      headers: {},
    };

    await postUserRegisterTokenHandler(stubConfig)(req, res, next);
    sinon.assert.calledOnce(jsonFuncStub);
    sinon.assert.calledWith(jsonFuncStub, {
      error: new Translation(ErrorCode.HTTP, "Token not found in headers"),
    });
  });

  it("should return unauthorized if token is not valid", async () => {
    const req: any = {
      headers: {
        "x-auth-token": "WrongToken",
      },
    };

    await postUserRegisterTokenHandler(stubConfig)(req, res, next);
    sinon.assert.calledOnce(jsonFuncStub);
    sinon.assert.calledWith(jsonFuncStub, {
      error: new Translation(ErrorCode.HTTP, "Wrong authorization token"),
    });
  });

  it("should call next function if token is valid", async () => {
    const req: any = {
      headers: {
        "x-auth-token": env.POST_USER_REGISTER_TOKEN,
      },
    };

    await postUserRegisterTokenHandler(stubConfig)(req, res, next);
    sinon.assert.calledOnce(next);
  });
});
