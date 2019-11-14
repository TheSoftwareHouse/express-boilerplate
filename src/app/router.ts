import * as express from "express";

export interface RoutingProps {
  usersRouting: express.Router;
  // ROUTES_INTERFACE
}

export const createRouter = ({
  usersRouting,
  // ROUTES_DEPENDENCIES
}: RoutingProps) => {
  const router = express.Router();

  router.use("/users", usersRouting);
  // ROUTES_CONFIG
  return router;
};
