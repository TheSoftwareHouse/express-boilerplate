module.exports = {
  type: "postgres",
  url: "postgres://postgres:password@postgres:5432/percent",
  synchronize: false,
  logging: true,
  entities: ["/app/build/src/infrastructure/models/**/*"],
  migrations: ["/app/build/src/infrastructure/migrations/*"],
  cli: {
    migrationsDir: "src/infrastructure/migrations",
  },
};
