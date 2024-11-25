-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `Comments_post_id_fkey`;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
