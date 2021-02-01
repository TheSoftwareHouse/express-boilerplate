import { Server } from "http";
import { Logger } from "@tshio/logger";
import "express-async-errors";
import { createContainer } from "./container";

(async () => {
  const container = await createContainer();
  process.on("uncaughtException", (err) => {
    container.resolve<Logger>("logger").error(`Uncaught: ${err.toString()}`, err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    if (err) {
      container.resolve<Logger>("logger").error(`Unhandled: ${err.toString()}`, err);
    }
    process.exit(1);
  });

  const server: Server = container.resolve("server");

  const port = container.resolve("port");
  server.listen(port);
  container.resolve<Logger>("logger").info(`listening on port: ${port}`);
})();
