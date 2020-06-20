import * as express from "express";

import { loginActionValidation } from "./actions/login.action";
import { usersActionValidation } from "./actions/users.action";
// VALIDATION_IMPORTS

export interface UsersRoutingDependencies {
  loginAction: express.RequestHandler;
  usersAction: express.RequestHandler;
  // ACTIONS_IMPORTS
}

export const usersRouting = (actions: UsersRoutingDependencies) => {
  const router = express.Router();

  router.post("/login", [loginActionValidation], actions.loginAction);
  router.get("/users", [usersActionValidation], actions.usersAction);
  // ACTIONS_SETUP

  return router;
};
