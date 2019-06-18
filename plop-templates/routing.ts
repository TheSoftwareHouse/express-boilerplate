import * as express from "express";
import { CommandBus } from "../../../shared/command-bus";

// COMMAND_IMPORTS

export interface {{capitalize name.camelCased}}RoutingProps {
  commandBus: CommandBus;
};

export const {{name.camelCased}}Routing = ({commandBus}: {{capitalize name.camelCased}}RoutingProps) => {
  const router = express.Router();

  // COMMANDS_SETUP

  return router;
};
