import { Router, RouterOptions } from "express";

export const getAuthenticationRouter = (routers: Router[], authPath = "/auth", options?: RouterOptions) => {
  const router = Router(options);
  router.use(authPath, routers);

  return router;
};
