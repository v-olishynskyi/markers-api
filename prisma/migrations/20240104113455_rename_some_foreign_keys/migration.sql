/*
  Warnings:

  - You are about to drop the column `user_id` on the `Markers` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `Markers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Markers" DROP CONSTRAINT "Markers_user_id_fkey";

-- AlterTable
ALTER TABLE "Markers" RENAME COLUMN "user_id" TO "author_id";

-- AddForeignKey
ALTER TABLE "Markers" ADD CONSTRAINT "Markers_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
