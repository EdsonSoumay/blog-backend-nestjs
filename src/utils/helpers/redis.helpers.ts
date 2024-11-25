// cek koneksi redis di service
const isRedisConnected = async (redisClient: any): Promise<boolean> => {
    try {
      await redisClient.ping();
      return true;
    } catch (err) {
      return false;
    }
  };
  
// menghapus cache Redis dengan pola dinamis
const clearCacheRedis = async (redisClient: any, cacheKeyPattern: string): Promise<void> => {
  if (redisClient.isOpen) {
    await redisClient.select(1); // Memilih database index 1
    // Hapus cache berdasarkan pola yang diberikan
    const keysToDelete = await redisClient.keys(cacheKeyPattern); // Ambil semua key yang sesuai pola
   // Jika ada keys yang ditemukan, gunakan multi() untuk batch delete
      if (keysToDelete.length > 0) {
          const multi = redisClient.multi(); // Membuat multi batch
          keysToDelete.forEach((key:any) => multi.del(key)); // Menambahkan perintah 'del' untuk setiap key
          await multi.exec(); // Eksekusi semua perintah dalam batch
      }
  }
};

export {isRedisConnected, clearCacheRedis}