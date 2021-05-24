import { RedisClient, createClient } from "redis";
import { createLogger, Logger } from "@tshio/logger";
import { loadEnvs } from "../config/env";

loadEnvs();

export interface CacheClient {
  get(key: string): Promise<any>;
  set(key: string, data: any, duration?: number): Promise<boolean>;
  removeByPattern(pattern: string): Promise<any>;
  scanByPattern(pattern: string): Promise<string[]>;
}

class CustomRedisClient implements CacheClient {
  private cacheClient: RedisClient;

  private logger: Logger;

  constructor() {
    this.cacheClient = createClient(process.env.REDIS_URL as string);
    this.logger = createLogger();
    this.cacheClient.on("error", (err) => {
      if (err) {
        this.logger.error(`Unhandled redis error: ${err.toString()}`, err);
      }
    });
  }

  public async get(key: string) {
    return new Promise((resolve) => {
      this.cacheClient.GET(key, (err, result) => {
        if (err || !result) return resolve(null);
        return resolve(JSON.parse(result));
      });
    });
  }

  public async set(key: string, data: any, duration: number = 1800): Promise<boolean> {
    return new Promise((resolve) => {
      this.cacheClient.SET(key, JSON.stringify(data), "EX", duration, (err, cachedData) => {
        this.logger.info(`Cache set for key: ${key}`);
        return resolve(cachedData === "OK");
      });
    });
  }

  public scanByPattern(pattern: string): Promise<string[]> {
    let returnKeys: string[] = [];
    function scan(cacheClient: RedisClient, cursor: string = "0"): Promise<any> {
      return new Promise((resolve, reject) => {
        cacheClient.SCAN(cursor, "MATCH", pattern, "COUNT", "10", (err, result: [string, string[]]) => {
          if (err) reject(err);
          const [newCoursor, newKeys] = result;
          returnKeys = [...newKeys, ...returnKeys];
          if (newCoursor === "0") {
            return resolve(returnKeys);
          }
          return resolve(scan(cacheClient, newCoursor));
        });
      });
    }

    return scan(this.cacheClient);
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
    this.logger.info(`Cache keys found to delete: ${foundKeys}`);
    await Promise.all(
      foundKeys.map(
        (key) =>
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
