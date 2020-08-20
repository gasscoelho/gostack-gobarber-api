import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';
  config: {
    redis: RedisOptions;
  };
}

export default {
  config: {
    redis: {
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASS || undefined,
      port: process.env.REDIS_PORT,
    },
  },
  driver: 'redis',
} as ICacheConfig;
