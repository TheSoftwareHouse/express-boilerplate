import { ModulesLoader } from "../src/modules/modules-loader";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { loadEnvs } from "./env";

loadEnvs();

const createDbConfigFromEnvs = (env: any, modules: string[]) => ({
  type: "postgres",
  host: env.RDS_HOSTNAME,
  port: env.RDS_PORT,
  database: env.RDS_DB_NAME,
  username: env.RDS_USERNAME,
  password: env.RDS_PASSWORD,
  synchronize: false,
  logging: true,
  entities: [
    "/app/build/src/features/**/*.model.js",
    ...modules.map((module) => `/app/build/src/modules/${module}/**/*.model.js`),
  ],
  migrations: [
    "/app/build/src/migrations/*",
    ...modules.map((module) => `/app/build/src/modules/${module}/migrations/*`),
  ],
  cli: {
    migrationsDir: "src/migrations",
  },
  namingStrategy: new SnakeNamingStrategy(),
});

const config = createDbConfigFromEnvs(
  process.env,
  ModulesLoader.activeModules.map((Module) => Module.moduleName),
);

export = config;
