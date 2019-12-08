import { RedisClient, createClient } from "redis";

const dotenv = require("dotenv-safe");

dotenv.config({
  example: ".env.dist",
});

// Need to inject logger
export interface CacheClient {
  get(key: string): Promise<any>;
  set(key: string, data: any, duration?: number): Promise<boolean>;
  flushAll(): Promise<any>;
}

class CustomRedisClient implements CacheClient {
  private cacheClient: RedisClient;

  constructor() {
    this.cacheClient = createClient(process.env.REDIS_URL as string);
  }

  public async get(key: string) {
    return new Promise(resolve => {
      this.cacheClient.GET(key, (err, result) => {
        if (err) return resolve(null);
        return resolve(JSON.parse(result));
      });
    });
  }

  public async set(key: string, data: any, duration: number = 1800): Promise<boolean> {
    return new Promise(resolve => {
      this.cacheClient.SET(key, JSON.stringify(data), "EX", duration, (err, cachedData) => {
        return resolve(cachedData === "OK");
      });
    });
  }

  public async flushAll() {
    return new Promise((resolve, reject) => {
      this.cacheClient.FLUSHALL((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}

export const cacheClient = new CustomRedisClient();
