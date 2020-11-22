import * as express from "express";
import { Action } from "../../../shared/http/types";

import { authLoginActionValidation } from "./actions/auth-login.action";
// VALIDATION_IMPORTS

export interface AuthModuleRoutingDependencies {
  authLoginAction: Action;
  // ACTIONS_IMPORTS
}

export const authRouting = (actions: AuthModuleRoutingDependencies) => {
  const router = express.Router();

  router.post("/login", [authLoginActionValidation], actions.authLoginAction.invoke.bind(actions.authLoginAction));
  // ACTIONS_SETUP

  return router;
};
