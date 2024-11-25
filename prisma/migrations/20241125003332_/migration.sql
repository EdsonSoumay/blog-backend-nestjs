-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `Posts_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
