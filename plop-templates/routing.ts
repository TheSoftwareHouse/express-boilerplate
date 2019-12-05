import * as express from "express";

// VALIDATION_IMPORTS

export interface {{pascalCase name}}RoutingProps {
  // ACTIONS_IMPORTS
}

export const {{camelCase name}}Routing = (actions: {{pascalCase name}}RoutingProps) => {
  const router = express.Router();

  // ACTIONS_SETUP

  return router;
};
