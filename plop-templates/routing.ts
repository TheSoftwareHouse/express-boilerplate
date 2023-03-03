import express from "express";
import { Action } from "../../../shared/http/types";

// VALIDATION_IMPORTS

export interface {{pascalCase name}}RoutingDependencies {
  // ACTIONS_IMPORTS
}

export const {{camelCase name}}Routing = (actions: {{pascalCase name}}RoutingDependencies) => {
  const router = express.Router();

  // ACTIONS_SETUP

  return router;
};
