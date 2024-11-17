import { Module, Global } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const redisClient: RedisClientType = createClient({
          password: '123456', // Sesuaikan dengan kata sandi Redis Anda
        });

        await redisClient.connect();

        redisClient.on('error', (error) => {
          console.error('Redis error:', error.message);
        });

        console.log('Redis connected successfully');
        return redisClient;
      },
    },
  ],
  exports: ['REDIS_CLIENT'], // Ekspor layanan Redis
})
export class RedisModule {}
