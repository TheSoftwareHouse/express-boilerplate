import * as express from "express";
import { Action } from "../../../shared/http/types";

// VALIDATION_IMPORTS

export interface AuthModuleRoutingDependencies {
  authLoginAction: Action;
  meAction: Action;
  // ACTIONS_IMPORTS
}

export const authRouting = (actions: AuthModuleRoutingDependencies) => {
  const router = express.Router();

  router.post("/login", actions.authLoginAction.invoke.bind(actions.authLoginAction));
  router.get("/me", actions.meAction.invoke.bind(actions.meAction));
  // ACTIONS_SETUP

  return router;
};
