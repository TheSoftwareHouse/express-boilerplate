import { createApp } from "./app/app";
import { config } from "../config/services";
import { createContainer } from "./container";
import { Logger } from "./shared/logger";

(async () => {
  const container = await createContainer();
  process.on("uncaughtException", err => {
    container
      .resolve<Logger>("logger")
      .error(`Uncaught: ${err.toString()}`, err);
    console.log(err);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    if (err) {
      container
        .resolve<Logger>("logger")
        .error(`Unhandled: ${err.toString()}`, err);
      console.log(err);
    }
    process.exit(1);
  });

  const app = createApp({ container });
  app.listen(config.percentApi.port);
  container
    .resolve<Logger>("logger")
    .info(`listening on port: ${config.percentApi.port}`);
})();
