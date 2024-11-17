-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `Posts_category_id_fkey`;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
