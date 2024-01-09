/*
  Warnings:

  - A unique constraint covering the columns `[group_id]` on the table `PublicFiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PublicFiles" ADD COLUMN     "group_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "PublicFiles_group_id_key" ON "PublicFiles"("group_id");

-- AddForeignKey
ALTER TABLE "PublicFiles" ADD CONSTRAINT "PublicFiles_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
