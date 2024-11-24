import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null; // Global variable untuk menyimpan client
let isConnecting = false; // Untuk mencegah percobaan koneksi paralel

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

    isConnecting = true; // Tandai bahwa koneksi sedang dilakukan

    const maxRetries = 3;
    const retryDelay = 5000; // 5 detik
    let retries = 0;

    while (retries < maxRetries) {
      try {
        redisClient = createClient({
          password: process.env.REDIS_PASSWORD,
        });

        await redisClient.connect(); // Coba koneksi
        console.log('Redis connected successfully');

        redisClient.on('error', (error) => {
          console.error('error redis');
          // retries++;
          // console.error(`Failed to connect to Redis (attempt ${retries}/${maxRetries})`);
        });

        isConnecting = false; // Tandai koneksi berhasil
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
      }
    }

    isConnecting = false; // Tandai bahwa koneksi gagal setelah semua percobaan
    redisClient = null;
    return null;
  },
};
