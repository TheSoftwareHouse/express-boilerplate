import * as express from "express";
import { Action } from "../../../shared/http/types";

import { authLoginActionValidation } from "./actions/auth-login.action";
import { meActionValidation } from "./actions/me.action";
// VALIDATION_IMPORTS

export interface AuthModuleRoutingDependencies {
  authLoginAction: Action;
  meAction: Action;
  // ACTIONS_IMPORTS
}

export const authRouting = (actions: AuthModuleRoutingDependencies) => {
  const router = express.Router();

  router.post("/login", [authLoginActionValidation], actions.authLoginAction.invoke.bind(actions.authLoginAction));
  router.get("/me", [meActionValidation], actions.meAction.invoke.bind(actions.meAction));
  // ACTIONS_SETUP

  return router;
};
