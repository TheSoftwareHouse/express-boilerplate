export interface AuthModuleConfig {
  securityHost: string;
  securityPort: string;
}

export const authModuleConfigFactory = (env: any) => ({
  securityHost: env.AUTH_MODULE_HOST ?? "security",
  securityPort: env.AUTH_MODULE_PORT ?? "50050",
});
