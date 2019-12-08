import { RedisClient, createClient } from "redis";
import { winstonLogger, Logger } from "../shared";
import { loadEnvs } from "../../config/env";

loadEnvs();

export interface CacheClient {
  get(key: string): Promise<any>;
  set(key: string, data: any, duration?: number): Promise<boolean>;
  removeByPattern(pattern: string): Promise<any>;
}

class CustomRedisClient implements CacheClient {
  private cacheClient: RedisClient;

  private logger: Logger;

  constructor() {
    this.cacheClient = createClient(process.env.REDIS_URL as string);
    this.logger = winstonLogger;
  }

  public async get(key: string) {
    return new Promise(resolve => {
      this.cacheClient.GET(key, (err, result) => {
        if (err) return resolve(null);
        resolve(JSON.parse(result));
      });
    });
  }

  public async set(key: string, data: any, duration: number = 1800): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.cacheClient.SET(key, JSON.stringify(data), "EX", duration, (err, cachedData) => {
        this.logger.info(`Cache set for key: ${key}`);
        return resolve(cachedData === "OK");
      });
    });
  }

  public async removeByPattern(pattern: string) {
    const keys = (keyPattern: string): Promise<string[]> =>
      new Promise((resolve, reject) => {
        this.cacheClient.KEYS(keyPattern, (err, result) => {
          if (err) return reject(err);

          return resolve(result);
        });
      });
    const foundKeys: string[] = await keys(pattern);
    await Promise.all(
      foundKeys.map(
        key =>
          new Promise((resolve, reject) => {
            this.cacheClient.DEL(key, (err, result) => {
              if (err) return reject(err);

              return resolve(result);
            });
          }),
      ),
    );
  }
}

export const cacheClient = new CustomRedisClient();
