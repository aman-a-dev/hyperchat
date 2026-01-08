/*
  Warnings:

  - You are about to drop the column `type` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Message` DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `job` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `verification` MODIFY `value` TEXT NOT NULL;
