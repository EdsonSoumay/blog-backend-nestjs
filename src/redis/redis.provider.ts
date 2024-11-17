import { createClient, RedisClientType } from 'redis';

export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async (): Promise<RedisClientType> => {
    const redisClient: RedisClientType = createClient({
      password: '123456', // Ganti dengan password Redis Anda
    });

    await redisClient.connect();

    redisClient.on('error', (error) => {
      console.error('Redis error:', error.message);
    });

    console.log('Redis connected successfully');
    return redisClient;
  },
};
