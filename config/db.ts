import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { loadEnvs } from "./env";

loadEnvs();

const createDbConfigFromEnvs = (env: any) => ({
  type: "postgres",
  url: env.POSTGRES_URL,
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
