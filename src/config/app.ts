import { Joi } from "celebrate";
import { pipeline } from "ts-pipe-compose";

export interface AppConfig {
  appName: string;
  port: string;
  env: string;
  deployedCommit: string;
  postUserRegisterToken: string;
  auth0Domain: string;
  auth0Audience: string;
}

const loadConfig = (env: any): AppConfig => ({
  appName: env.APP_NAME ?? "boilerplate_api",
  port: env.PORT ?? "1337",
  env: env.STAGE,
  deployedCommit: env.BITBUCKET_COMMIT,
  postUserRegisterToken: env.POST_USER_REGISTER_TOKEN,
  auth0Domain: env.AUTH0_DOMAIN,
  auth0Audience: env.AUTH0_AUDIENCE,
});

const validateConfig = (config: AppConfig) => {
  const schema = Joi.object<AppConfig>().keys({
    appName: Joi.string().required(),
    port: Joi.string().required(),
    env: Joi.string().required(),
    deployedCommit: Joi.string().required(),
    postUserRegisterToken: Joi.string().required(),
    auth0Domain: Joi.string().required(),
    auth0Audience: Joi.string().required(),
  });
  const { error, value } = schema.validate(config);

  if (error) {
    throw error;
  }

  return value;
};

export const appConfigFactory = pipeline(loadConfig, validateConfig);
