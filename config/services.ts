export const makePercentApiConfig = (env: any) => ({
  appName: "percent_api",
  port: "1337",
  externalAuthSecret: env.EXTERNAL_AUTH_SECRET,
  accessTokenKey: env.ACCESS_TOKEN_KEY,
  refreshTokenKey: env.REFRESH_TOKEN_KEY,
  accessTokenExpirationTime: env.ACCESS_TOKEN_EXPIRATION_TIME,
  refreshTokenExpirationTime: env.REFRESH_TOKEN_EXPIRATION_TIME,
  redisPersistTime: env.REDIS_PERSIST_TIME,
});
