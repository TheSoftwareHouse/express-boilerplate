const dotenv = require("dotenv-safe");

const loadEnvs = (env: any) => ({
  type: "postgres",
  url: env.POSTGRES_URL,
  synchronize: false,
  logging: true,
  entities: ["/app/build/src/**/*.model.js"],
  migrations: ["/app/build/src/migrations/*"],
  cli: {
    migrationsDir: "src/migrations",
  },
});

dotenv.config({
  example: ".env.dist",
});

const config = loadEnvs(process.env);

module.exports = config;
