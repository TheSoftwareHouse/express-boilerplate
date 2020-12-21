import * as express from "express";
import { Action } from "../../../shared/http/types";

// VALIDATION_IMPORTS

export interface AuthModuleRoutingDependencies {
  authLoginAction: Action;
  googleLoginAction: Action;
  facebookLoginAction: Action;
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
    googleLoginAction,
    facebookLoginAction,
    meAction,
    registerAction,
    resetPasswordAction,
    changePasswordAction,
    authTokenHandlerMiddleware,
  } = dependencies;

  router.post("/login", authLoginAction.invoke.bind(authLoginAction));
  router.post("/login/google", googleLoginAction.invoke.bind(googleLoginAction));
  router.post("/login/facebook", facebookLoginAction.invoke.bind(facebookLoginAction));
  router.get("/me", [authTokenHandlerMiddleware], meAction.invoke.bind(meAction));
  router.post("/register", registerAction.invoke.bind(registerAction));
  router.post("/change-password/:resetPasswordToken", changePasswordAction.invoke.bind(changePasswordAction));
  router.post("/reset-password", resetPasswordAction.invoke.bind(resetPasswordAction));
  // ACTIONS_SETUP

  return router;
};
