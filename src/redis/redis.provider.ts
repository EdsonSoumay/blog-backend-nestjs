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
    const maxRetries = 3;
    let retries = 0
    const retryDelay = 3000;

    while (retries < maxRetries) {
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
          retries++;
          console.error(`Failed to connect to Redis (attempt ${retries}/${maxRetries}):`, error.message);

          if (retries < maxRetries) {
            console.log('Retrying to connect to Redis...');
            await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Tunggu sebelum mencoba ulang
          } else {
            console.error('Max retries reached. Redis will not be connected.');
          }

          isConnecting = false;
        }
      }
    }
};