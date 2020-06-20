import * as express from "express";

// VALIDATION_IMPORTS

export interface {{pascalCase name}}RoutingDependencies {
  // ACTIONS_IMPORTS
}

export const {{camelCase name}}Routing = (actions: {{pascalCase name}}RoutingDependencies) => {
  const router = express.Router();

  // ACTIONS_SETUP

  return router;
};
