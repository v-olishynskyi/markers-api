/*
  Warnings:

  - Added the required column `owner_id` to the `Groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Groups" ADD COLUMN     "owner_id" UUID NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "middle_name" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Groups" ADD CONSTRAINT "Groups_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
