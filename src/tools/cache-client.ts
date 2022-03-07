import { createClient } from "redis";
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
  private readonly cacheClient: ReturnType<typeof createClient>;

  private logger: Logger;

  constructor() {
    this.cacheClient = createClient({ url: process.env.REDIS_URL as string });
    this.logger = createLogger();
    this.cacheClient.on("error", (err) => {
      if (err) {
        this.logger.error(`Unhandled redis error: ${err.toString()}`, err);
      }
    });
  }

  public async connect() {
    return this.cacheClient.connect();
  }

  public async get(key: string) {
    try {
      const result = await this.cacheClient.get(key);
      if (!result) {
        return null;
      }
      return JSON.parse(result);
    } catch (err) {
      return null;
    }
  }

  public async set(key: string, data: any, duration: number = 1800): Promise<boolean> {
    const status = await this.cacheClient.set(key, JSON.stringify(data), {
      EX: duration,
    });

    this.logger.info(`Cache set for key: ${key}`);

    return status === "OK";
  }

  public scanByPattern(pattern: string): Promise<string[]> {
    let returnKeys: string[] = [];
    function scan(cacheClient: ReturnType<typeof createClient>, cursor: number = 0): Promise<any> {
      return cacheClient
        .scan(cursor, {
          MATCH: pattern,
          COUNT: 10,
        })
        .then((result) => {
          returnKeys = [...result.keys, ...returnKeys];
          if (result.cursor === 0) {
            return returnKeys;
          }
          return scan(cacheClient, result.cursor);
        });
    }

    return scan(this.cacheClient);
  }

  public async removeByPattern(pattern: string) {
    const foundKeys: string[] = await this.cacheClient.keys(pattern);
    this.logger.info(`Cache keys found to delete: ${foundKeys}`);
    await Promise.all(foundKeys.map((key) => this.cacheClient.del(key)));
  }
}

export const cacheClient = new CustomRedisClient();
