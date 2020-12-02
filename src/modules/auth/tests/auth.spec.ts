import * as Request from "supertest";
import * as nock from "nock";
import { OK } from "http-status-codes";
import * as assert from "assert";
import { decode } from "jsonwebtoken";

describe("Auth Module", () => {
  const request = Request(`http://${process.env.AUTH_MODULE_HOST}:${process.env.AUTH_MODULE_PORT}`);

  it("return cached query result", async () => {
    nock(`http://${process.env.AUTH_MODULE_HOST}:${process.env.AUTH_MODULE_PORT}`).post("/auth/login").reply(200, {
      accessToken:
        "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI2SFE0cmFNYmRVSnZLaXFoTW4zal9GRGpTRlBrQ3EzRnVSNDg4ZTh0bjdrIn0.eyJleHAiOjE2MDY4MjM3MjYsImlhdCI6MTYwNjgyMzQyNiwiYXV0aF90aW1lIjoxNjA2ODIzNDI2LCJqdGkiOiJhMTk3ZjgxMi0zNzIzLTRiNTMtYmE4Ny1kMWE2ZGEyMDE1M2MiLCJpc3MiOiJodHRwczovL2tleWNsb2FrLmF3cy50c2hkZXYuaW8vYXV0aC9yZWFsbXMvVFNIIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImU4NTE2ZTBlLTMwYWQtNDZjMS1hZTg4LTgxYTk1ZjdiOTg2MCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJhZC1zZWN1cml0eSIsInNlc3Npb25fc3RhdGUiOiI1YmQzOWUyYy03NzhjLTQ1NDgtYjViMS0wNWQ5NGQ3NjUzNWMiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiU0FMRVNfQVBQX1NUQUdJTkciXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50Iiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgYXR0cmlidXRlcyBlbWFpbCBvZmZsaW5lX2FjY2VzcyBzZWN1cml0eS1zZXJ2aWNlIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwidXNlcl9pZCI6ImU4NTE2ZTBlLTMwYWQtNDZjMS1hZTg4LTgxYTk1ZjdiOTg2MCIsIm5hbWUiOiJNYXJjaW4gS29wYSIsInByZWZlcnJlZF91c2VybmFtZSI6Im1hcmNpbi5rb3BhQHRzaC5pbyIsImdpdmVuX25hbWUiOiJNYXJjaW4iLCJmYW1pbHlfbmFtZSI6IktvcGEiLCJlbWFpbCI6Im1hcmNpbi5rb3BhQHRzaC5pbyIsInVzZXJuYW1lIjoibWFyY2luLmtvcGFAdHNoLmlvIn0.QO1TAtxw0ivMUZwy6dXSDE43ntNS4kZdQsfSeep132bFwBHXkYZYlOuHtev86M8EUi4TkhQTKMqrB_NEfAzJsSSGtdNEbqvSk3fBXHtE9E6OUzTWnB4lU9X57p2uq777EpDFef1QmY0fTzuakHdV54xJsfSEWgwdBwaHHSCUT7BUc2kJCKeHFkwiTLPkKj7cZ08nGHYgBpDNVxMwOEe1LUHcaTkvb8nDVFJOid_Zobs2LcEisVM2W31VA_rztdxs6QiITGLRc6k1MosMhj3qHudKPrmsylnEuaOzdu8ExeCf_v54QaFu6LzyWNsArVgqfHl17xk1wORLmclCv1TlZQ",
      refreshToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI1ODMxOGExOS1jNDI1LTRiOWEtYWFkNy1jMDY1YTk3NjNmNDkifQ.eyJpYXQiOjE2MDY4MjM0MjYsImp0aSI6ImY0MmZkYWZkLTMyMjktNDFiNC1iZGMzLWE3OTMzMTQxZGUyOSIsImlzcyI6Imh0dHBzOi8va2V5Y2xvYWsuYXdzLnRzaGRldi5pby9hdXRoL3JlYWxtcy9UU0giLCJhdWQiOiJodHRwczovL2tleWNsb2FrLmF3cy50c2hkZXYuaW8vYXV0aC9yZWFsbXMvVFNIIiwic3ViIjoiZTg1MTZlMGUtMzBhZC00NmMxLWFlODgtODFhOTVmN2I5ODYwIiwidHlwIjoiT2ZmbGluZSIsImF6cCI6InJhZC1zZWN1cml0eSIsInNlc3Npb25fc3RhdGUiOiI1YmQzOWUyYy03NzhjLTQ1NDgtYjViMS0wNWQ5NGQ3NjUzNWMiLCJzY29wZSI6Im9wZW5pZCBhdHRyaWJ1dGVzIGVtYWlsIG9mZmxpbmVfYWNjZXNzIHNlY3VyaXR5LXNlcnZpY2UgcHJvZmlsZSJ9.45E5mIgQBrihWE33XQea9ti5wUs21MCWO8bdM0Urkak",
    });

    const { body } = await request
      .post("/auth/login")
      .send({ username: "superadmin", password: "password" })
      .expect("Content-Type", /json/)
      .expect(OK);

    assert(decode(body.accessToken));
    assert(decode(body.refreshToken));
  });
});
