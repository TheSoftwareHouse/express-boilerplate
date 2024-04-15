import sinon from "sinon";
import { Translation } from "../shared/translation/translation";
import { ErrorCode } from "../shared/constants/error-code.enum";
import { checkTokenPayload } from "./auth0";

const jsonFuncStub = sinon.stub();

const res: any = {
  status: () => res,
  json: jsonFuncStub,
  locals: {},
};

const stubConfig = {
  logger: {
    error: sinon.stub(),
  },
  appConfig: {},
} as any;

const next = sinon.stub();

describe("Auth0 validation", () => {
  beforeEach(() => {
    sinon.reset();
  });

  it("should return unauthorized if token does not contain payload", async () => {
    const req: any = {};

    await checkTokenPayload(stubConfig)(req, res, next);

    sinon.assert.calledOnce(jsonFuncStub);
    sinon.assert.calledWith(jsonFuncStub, {
      error: new Translation(ErrorCode.HTTP, "Authorization token is not valid"),
    });
  });

  it("should return unauthorized if payload does not contain me details", async () => {
    const req: any = {
      auth: {
        payload: {},
      },
    };

    await checkTokenPayload(stubConfig)(req, res, next);

    sinon.assert.calledOnce(jsonFuncStub);
    sinon.assert.calledWith(jsonFuncStub, {
      error: new Translation(ErrorCode.HTTP, "Authorization token is not valid"),
    });
  });

  it("should call next function if payload is valid", async () => {
    const req: any = {
      auth: {
        payload: {
          me: {
            email: "john@doe@example.com",
          },
        },
      },
    };

    await checkTokenPayload(stubConfig)(req, res, next);

    sinon.assert.calledOnce(next);
  });
});
