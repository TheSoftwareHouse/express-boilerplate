import { createApp } from "./app/app";
import { createContainer } from "./container";
import { Logger } from "./shared/logger";

(async () => {
  const container = await createContainer();
  process.on("uncaughtException", err => {
    container
      .resolve<Logger>("logger")
      .error(`Uncaught: ${err.toString()}`, err);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    if (err) {
      container
        .resolve<Logger>("logger")
        .error(`Unhandled: ${err.toString()}`, err);
    }
    process.exit(1);
  });

  const app = createApp({ container });
  const port = container.resolve("port");
  app.listen(port);
  container.resolve<Logger>("logger").info(`listening on port: ${port}`);
})();
