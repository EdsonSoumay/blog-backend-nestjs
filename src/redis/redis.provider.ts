import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;
let isConnecting = false;

export const RedisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async (): Promise<RedisClientType | null> => {
    if (redisClient) {
      console.log('Redis client already initialized.');
      return redisClient;
    }

    if (isConnecting) {
      console.warn('Redis client is currently connecting, please wait.');
      return null;
    }

    isConnecting = true;

    try {
      redisClient = createClient({
        password: process.env.REDIS_PASSWORD,
      });

      await redisClient.connect();
      console.log('Redis connected successfully');

      redisClient.on('error', async (error) => {
        console.error('Redis error:', error.message);

        if (error.message.includes('Socket closed unexpectedly')) {
          console.warn('Socket closed. Reconnecting...');
          if (redisClient) {
            await redisClient.quit(); // Tutup koneksi
            redisClient = null;
          }
          isConnecting = false;
          await RedisProvider.useFactory(); // Panggil ulang untuk koneksi ulang
        }
      });

      redisClient.on('end', () => {
        console.warn('Redis connection ended.');
      });

      isConnecting = false;
      return redisClient;
    } catch (error: any) {
      console.error('Failed to connect to Redis:', error.message);
      isConnecting = false;
      return null;
    }
  },
};
