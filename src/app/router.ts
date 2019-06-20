import * as express from "express";

export interface RoutingProps {
  usersRouting: express.Router;
// ROUTES_INTERFACE
}

export const router = ({
  usersRouting,
// ROUTES_DEPENDENCIES
} : RoutingProps) => {
  const router = express.Router();

  router.use(usersRouting);
// ROUTES_CONFIG
  return router;
};
