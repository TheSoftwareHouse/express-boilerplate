import { AwilixContainer } from "awilix";
import * as awilix from "awilix";
import * as config from "../../config/modules";

export async function registerModules(container: AwilixContainer) {
  container.register({
    dbConnection: awilix.asValue(config),
  });
}
