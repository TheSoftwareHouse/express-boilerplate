import { Server } from "http";
import { Logger } from "@tshio/logger";
import "express-async-errors";
import { createContainer } from "./container";

// const express = require("express");
// import { Request, Response } from "express";
// const app = express();
// const port = 1337; // default port to listen

(async () => {
  // app.get("/", (req: Request, res: Response) => {
  //   res.send("Hello world!");
  // });
  //
  // // start the Express server
  // app.listen(port, () => {
  //   console.log(`server started at http://localhost:${port}`);
  // });
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
