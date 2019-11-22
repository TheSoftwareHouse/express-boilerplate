import * as express from "express";
import { CommandBus } from "../../../shared/command-bus";
import { QueryBus } from "../../../shared/query-bus";

import { loginAction, loginActionValidation } from "./actions/login.action";
import { usersAction, usersActionValidation } from "./actions/users.action";
// COMMAND_IMPORTS

export interface UsersRoutingProps {
  commandBus: CommandBus;
  queryBus: QueryBus;
}

// eslint-disable-next-line
export const usersRouting = ({ commandBus, queryBus }: UsersRoutingProps) => {
  const router = express.Router();

  router.post("/login", [loginActionValidation], loginAction({ commandBus }));
  router.get("/users", [usersActionValidation], usersAction({ queryBus }));
  // COMMANDS_SETUP

  return router;
};
