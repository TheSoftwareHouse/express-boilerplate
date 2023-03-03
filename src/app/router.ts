import express from "express";

export interface RoutingDependencies {
  usersRouting: express.Router;
  // ROUTES_INTERFACE
}

export const createRouter = ({
  usersRouting,
  // ROUTES_DEPENDENCIES
}: RoutingDependencies) => {
  const router = express.Router();

  router.use("/example", usersRouting);
  // ROUTES_CONFIG
  return router;
};
