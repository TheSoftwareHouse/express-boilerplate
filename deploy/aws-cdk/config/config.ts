export interface AppConfig {
  appDomain: string;
  logPrefix: string;
  redis: {
    port: number;
  };
  postgresRds: {
    databaseName: string;
    username: string;
    password: string;
    port: number;
    autoMinorVersionUpgrade: boolean;
    allocatedStorage: number;
    backupRetention: number;
  };
}

export const appConfig: AppConfig = {
  appDomain: process.env.APP_DOMAIN ?? "tshio",
  logPrefix: process.env.LOG_PREFIX ?? "/ecs/express-boilerplate",
  redis: {
    port: +(process.env.REDIS_PORT ?? 6379),
  },
  postgresRds: {
    databaseName: process.env.DB_NAME ?? "app",
    username: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD ?? "poastgres",
    port: +(process.env.DB_PORT ?? 3306),
    autoMinorVersionUpgrade: (process.env.DB_AUTO_MINOR_VERSION_UPGRADE || "false") === "true",
    allocatedStorage: +(process.env.DB_ALLOCATED_STORAGE ?? 25), // GB
    backupRetention: +(process.env.DB_BACKUP_RETENTION ?? 3), // days
  },
};
