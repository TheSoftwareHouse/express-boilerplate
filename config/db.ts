module.exports = {
  type: "postgres",
  url: "postgres://postgres:password@postgres:5432/percent",
  synchronize: false,
  logging: true,
  entities: ["/app/build/src/**/*.model.*"],
  migrations: ["/app/build/src/migrations/*"],
  cli: {
    migrationsDir: "src/migrations",
  },
};
