import * as express from "express";
import { CommandBus } from "../../../shared/command-bus";
import { QueryBus } from "../../../shared/query-bus";

// COMMAND_IMPORTS

export interface {{pascalCase name}}RoutingProps {
  commandBus: CommandBus;
  queryBus: QueryBus;
}

export const {{camelCase name}}Routing = ({ commandBus, queryBus }: {{pascalCase name}}RoutingProps) => {
  const router = express.Router();

  // COMMANDS_SETUP

  return router;
};
