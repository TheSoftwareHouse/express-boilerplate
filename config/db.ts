module.exports = (env: any) => ({
  type: "postgres",
  url: env.POSTGRES_URL,
  synchronize: false,
  logging: true,
  entities: ["/app/build/src/**/*.model.*"],
  migrations: ["/app/build/src/migrations/*"],
  cli: {
    migrationsDir: "src/migrations",
  },
});
