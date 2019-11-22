import * as express from "express";
import { CommandBus } from "../../../shared/command-bus";
import { QueryBus } from "../../../shared/query-bus";

// COMMAND_IMPORTS

export interface {{capitalize name.camelCased}}RoutingProps {
  commandBus: CommandBus;
  queryBus: QueryBus;
};

export const {{name.camelCased}}Routing = ({commandBus, queryBus}: {{capitalize name.camelCased}}RoutingProps) => {
  const router = express.Router();

  // COMMANDS_SETUP

  return router;
};
