import { Joi } from "celebrate";
import { pipeline } from "ts-pipe-compose";

export interface AppConfig {
  appName: string;
  port: string;
  env: string | undefined;
}

const loadConfig = (env: any) => ({
  appName: env.APP_NAME ?? "boilerplate_api",
  port: env.PORT ?? "1337",
  env: env.NODE_ENV ?? "development",
});

const validateConfig = (config: any) => {
  const schema = Joi.object().keys({
    appName: Joi.string().required(),
    port: Joi.string().required(),
    env: Joi.string().required(),
  });
  const { error, value } = schema.validate(config);

  if (error) {
    throw error;
  }

  return value;
};

export const appConfigFactory = pipeline(loadConfig, validateConfig);
