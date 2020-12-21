export interface AuthModuleConfig {
  securityHost: string;
  securityPort: string;
  defaultUserAttributes: string[];
  apiKey: string;
}

export const authModuleConfigFactory = (env: any) => ({
  host: env.AUTH_MODULE_HOST ?? "security",
  port: env.AUTH_MODULE_PORT ?? "50050",
  defaultUserAttributes: env.AUTH_DEFAULT_USER_ATTRIBUTES ? env.AUTH_DEFAULT_USER_ATTRIBUTES.split(",") : ["NEW_USER"],
  apiKey: env.AUTH_API_KEY ?? "b6cfcd8f-db8e-2cb5-cb34-e1a8900067fd",
});
