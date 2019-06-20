import { v4 } from "uuid";
import { createConnection } from "typeorm";
import { UserRoleModel } from "../app/users/models/user-role.model";
import { UserDetailsModel } from "../app/users/models/user-details.model";

const dbConfig = require("../../config/db");

(async () => {
  const dbConnection = await createConnection(dbConfig);
  await dbConnection.runMigrations();

  const roles = dbConnection.getRepository(UserRoleModel);
  const users = dbConnection.getRepository(UserDetailsModel);

  if (!(await users.count())) {
    const saved = await roles.save([
      UserRoleModel.create({
        name: "CAUSE",
      }),
      UserRoleModel.create({
        name: "REVIEWER",
      }),
      UserRoleModel.create({
        name: "ADMIN",
      }),
    ]);

    const admin = saved.find(role => role.name === "ADMIN");

    if (admin) {
      await users.save(
        UserDetailsModel.create({
          id: v4(),
          assignedReviews: [],
          role: admin,
        }),
      );
    }
  }

  await dbConnection.close();
})();
