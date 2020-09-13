export interface AppConfig {
  appName: string;
  port: string;
  env: string | undefined;
}

export const appConfigFactory = (env: any) => ({
  appName: env.APP_NAME ?? "boilerplate_api",
  port: env.PORT ?? "1337",
  env: env.NODE_ENV ?? "development",
});
