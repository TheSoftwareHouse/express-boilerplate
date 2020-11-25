import * as express from "express";
import { Action } from "../../../shared/http/types";

// VALIDATION_IMPORTS

export interface AuthModuleRoutingDependencies {
  authLoginAction: Action;
  meAction: Action;
  registerAction: Action;
  changePasswordAction: Action;
  authTokenHandlerMiddleware: any;
  // ACTIONS_IMPORTS
}

export const authRouting = (dependencies: AuthModuleRoutingDependencies) => {
  const router = express.Router();
  const { authLoginAction, meAction, registerAction, changePasswordAction, authTokenHandlerMiddleware } = dependencies;

  router.post("/login", authLoginAction.invoke.bind(authLoginAction));
  router.get("/me", [authTokenHandlerMiddleware], meAction.invoke.bind(meAction));
  router.post("/register", registerAction.invoke.bind(registerAction));
  router.post("/change-password", changePasswordAction.invoke.bind(changePasswordAction));
  // ACTIONS_SETUP

  return router;
};
