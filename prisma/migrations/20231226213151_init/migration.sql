/*
  Warnings:

  - You are about to drop the column `last_mame` on the `Users` table. All the data in the column will be lost.
  - Added the required column `last_name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "last_mame",
ADD COLUMN     "last_name" VARCHAR(255) NOT NULL;
