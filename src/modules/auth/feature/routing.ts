import * as express from "express";
import { Action } from "../../../shared/http/types";

// VALIDATION_IMPORTS

export interface AuthModuleRoutingDependencies {
  authLoginAction: Action;
  meAction: Action;
  registerAction: Action;
  resetPasswordAction: Action;
  changePasswordAction: Action;
  authTokenHandlerMiddleware: any;
  // ACTIONS_IMPORTS
}

export const authRouting = (dependencies: AuthModuleRoutingDependencies) => {
  const router = express.Router();
  const {
    authLoginAction,
    meAction,
    registerAction,
    resetPasswordAction,
    changePasswordAction,
    authTokenHandlerMiddleware,
  } = dependencies;

  router.post("/login", authLoginAction.invoke.bind(authLoginAction));
  router.get("/me", [authTokenHandlerMiddleware], meAction.invoke.bind(meAction));
  router.post("/register", registerAction.invoke.bind(registerAction));
  router.post("/change-password/:resetPasswordToken", changePasswordAction.invoke.bind(changePasswordAction));
  router.post("/reset-password", resetPasswordAction.invoke.bind(resetPasswordAction));
  // ACTIONS_SETUP

  return router;
};
