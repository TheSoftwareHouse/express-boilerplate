import "mocha";
import { use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { DataSource } from "typeorm";
import "express-async-errors";
import { createContainer } from "../container";
import { config } from "../config/db";
import "express-async-errors";

use(chaiAsPromised);

const clearDb = async (_dataSource: DataSource) => {};

before(async () => {
  const dbConnection = await new DataSource({
    ...config,
    logging: false,
  }).initialize();

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
    await global.dbConnection.destroy();
  }
});
