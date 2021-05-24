import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { Joi } from "celebrate";
import { pipeline } from "ts-pipe-compose";
import { loadEnvs } from "./env";
import { ModulesLoader } from "../modules/modules-loader";

loadEnvs();

const loadDbConfigFromEnvs = (env: any, modules: string[]) => ({
  type: "postgres",
  host: env.RDS_HOSTNAME,
  port: env.RDS_PORT,
  database: env.RDS_DB_NAME,
  username: env.RDS_USERNAME,
  password: env.RDS_PASSWORD,
  synchronize: false,
  logging: true,
  entities: [
    "/app/build/src/app/features/**/*.model.js",
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

const validateDbConfig = (config: any) => {
  const schema = Joi.object().keys({
    type: Joi.string().required(),
    host: Joi.string().required(),
    port: Joi.string().required(),
    database: Joi.string().required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
    synchronize: Joi.any().allow(false).required(),
    logging: Joi.boolean().required(),
    entities: Joi.array().items(Joi.string().required()).required(),
    migrations: Joi.array().items(Joi.string().required()).required(),
    cli: Joi.object()
      .keys({
        migrationsDir: Joi.string().required(),
      })
      .required(),
    namingStrategy: Joi.any(),
  });

  const { error, value } = schema.validate(config);

  if (error) {
    throw error;
  }

  return value;
};

const createDbConfigFromEnvs = pipeline(loadDbConfigFromEnvs, validateDbConfig);

const config = createDbConfigFromEnvs(
  process.env,
  ModulesLoader.activeModules.map((Module) => Module.moduleName),
);

module.exports = config;
