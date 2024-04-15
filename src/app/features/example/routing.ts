import express from "express";
import { Action } from "../../../shared/http/types";

import { loginActionValidation } from "./actions/login.action";
import { usersActionValidation } from "./actions/users.action";
import { postUserRegistrationActionValidation } from "./actions/post-user-registration.action";
import { MiddlewareType } from "../../../shared/middleware-type/middleware.type";
import { meActionValidation } from "./actions/me.action";
// VALIDATION_IMPORTS

export interface UsersRoutingDependencies {
  loginAction: Action;
  usersAction: Action;
  postUserRegistrationAction: Action;
  postUserRegisterTokenHandler: MiddlewareType;
  checkTokenPayload: MiddlewareType;
  validateAccessToken: MiddlewareType;
  meAction: Action;
  // ACTIONS_IMPORTS
}

export const usersRouting = (actions: UsersRoutingDependencies) => {
  const router = express.Router();

  router.post("/login", [loginActionValidation], actions.loginAction.invoke.bind(actions.loginAction));
  router.get("/users", [usersActionValidation], actions.usersAction.invoke.bind(actions.usersAction));
  router.post(
    "/post-user-registration",
    [actions.postUserRegisterTokenHandler, postUserRegistrationActionValidation],
    actions.postUserRegistrationAction.invoke.bind(actions.postUserRegistrationAction),
  );
  router.get(
    "/me",
    [actions.validateAccessToken, actions.checkTokenPayload, meActionValidation],
    actions.meAction.invoke.bind(actions.meAction),
  );
  // ACTIONS_SETUP

  return router;
};
