import * as express from "express";
import { Action } from "../../../shared/http/types";

import { loginActionValidation } from "./actions/login.action";
import { usersActionValidation } from "./actions/users.action";
// VALIDATION_IMPORTS

export interface UsersRoutingDependencies {
  loginAction: Action;
  usersAction: Action;
  // ACTIONS_IMPORTS
}

export const usersRouting = (actions: UsersRoutingDependencies) => {
  const router = express.Router();

  router.post("/login", [loginActionValidation], actions.loginAction.invoke.bind(actions.loginAction));
  router.get("/example", [usersActionValidation], actions.usersAction.invoke.bind(actions.usersAction));
  // ACTIONS_SETUP

  return router;
};
