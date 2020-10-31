import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { loadEnvs } from "./env";

loadEnvs();

const createDbConfigFromEnvs = (env: any) => ({
  type: "postgres",
  host: env.RDS_HOSTNAME,
  port: env.RDS_PORT,
  database: env.RDS_DB_NAME,
  username: env.RDS_USERNAME,
  password: env.RDS_PASSWORD,
  synchronize: false,
  logging: true,
  entities: ["/app/build/src/**/*.model.js"],
  migrations: ["/app/build/src/migrations/*"],
  cli: {
    migrationsDir: "src/migrations",
  },
  namingStrategy: new SnakeNamingStrategy(),
});

const config = createDbConfigFromEnvs(process.env);

export = config;
