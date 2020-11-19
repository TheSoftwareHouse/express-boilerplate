import { loadEnvs } from "./env";

loadEnvs();

const createModulesConfigFromEnvs = (env: any) => ({
  security: {
    host: "localhost" || env.RAD_SECURITY_HOSTNAME,
    port: 50050 || env.RAD_SECURITY_PORT,
  },
});

const config = createModulesConfigFromEnvs(process.env);

export = config;
