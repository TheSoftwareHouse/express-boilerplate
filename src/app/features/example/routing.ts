import express from "express";
import { Action } from "../../../shared/http/types";

import { loginActionValidation } from "./actions/login.action";
import { usersActionValidation } from "./actions/users.action";
import { postUserRegistrationActionValidation } from "./actions/post-user-registration.action";
// VALIDATION_IMPORTS

export interface UsersRoutingDependencies {
  loginAction: Action;
  usersAction: Action;
  postUserRegistrationAction: Action;
  // ACTIONS_IMPORTS
}

export const usersRouting = (actions: UsersRoutingDependencies) => {
  const router = express.Router();

  router.post("/login", [loginActionValidation], actions.loginAction.invoke.bind(actions.loginAction));
  router.get("/users", [usersActionValidation], actions.usersAction.invoke.bind(actions.usersAction));
  router.post(
    "/post-user-registration",
    [postUserRegistrationActionValidation],
    actions.postUserRegistrationAction.invoke.bind(actions.postUserRegistrationAction),
  );
  // ACTIONS_SETUP

  return router;
};
