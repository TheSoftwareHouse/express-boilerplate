import { createConnection } from "typeorm";
import { UserRoleModel } from "../app/users/models/user-role.model";
import { UserDetailsModel } from "../app/users/models/user-details.model";
import {
  ADMIN_ID,
  CAUSE_ID,
  REVIEWER_ID,
} from "../tools/external-authentication-mock/external-authentication-mock";

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
    const cause = saved.find(role => role.name === "CAUSE");
    const reviewer = saved.find(role => role.name === "REVIEWER");

    if (admin) {
      await users.save([
        UserDetailsModel.create({
          id: ADMIN_ID,
          assignedReviews: [],
          role: admin,
        }),
        UserDetailsModel.create({
          id: REVIEWER_ID,
          assignedReviews: [],
          role: reviewer,
        }),
        UserDetailsModel.create({
          id: CAUSE_ID,
          assignedReviews: [],
          role: cause,
        }),
      ]);
    }
  }

  await dbConnection.close();
})();
