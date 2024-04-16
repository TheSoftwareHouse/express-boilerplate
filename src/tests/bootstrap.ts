import "mocha";
import { use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { DataSource } from "typeorm";
import sinon from "sinon";
import "express-async-errors";
import { createContainer } from "../container";
import { config } from "../config/db";
import "express-async-errors";
import * as auth0Module from "../middleware/auth0";

use(chaiAsPromised);

const clearDb = async (dataSource: DataSource) => {
  const entities = dataSource.entityMetadatas;

  await dataSource.manager.transaction(async (transactionalEntityManager) => {
    // disable checking relations
    await transactionalEntityManager.query("SET session_replication_role = replica;");

    await Promise.all(entities.map((entity) => transactionalEntityManager.query(`DELETE FROM "${entity.tableName}"`)));

    // enable checking relations
    await transactionalEntityManager.query("SET session_replication_role = origin;");
  });
};

before(async () => {
  const dbConnection = await new DataSource({
    ...config,
    logging: false,
  }).initialize();

  global.dbConnection = dbConnection;
  await dbConnection.dropDatabase();
  sinon.stub(auth0Module, "validateAccessToken").callsFake(() => (req, res, next) => {
    // eslint-disable-next-line no-param-reassign
    req.auth = {
      payload: {
        me: {
          email: "test@integration.com",
        },
      },
      header: {},
      token: "",
    };

    return next();
  });

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
