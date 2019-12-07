import "mocha";
import { use } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { config as dotenvConfig } from "dotenv-safe";
import { createConnection, Connection } from "typeorm";
import { createContainer } from "../src/container";

dotenvConfig({
  example: ".env.dist",
});

const dbConfig = require("../config/db");

use(chaiAsPromised);

// eslint-disable-next-line
const clearDb = async (connection: Connection) => {};

before(async () => {
  const dbConnection = await createConnection({
    name: "integration-tests-connection",
    ...dbConfig,
    logging: false,
  });

  global.dbConnection = dbConnection;
  await dbConnection.dropDatabase();

  global.container = await createContainer();
});

beforeEach(async () => {
  if (global.dbConnection) {
    await clearDb(global.dbConnection);
  }
});

after(async () => {
  if (global.dbConnection) {
    await global.dbConnection.close();
  }
});
