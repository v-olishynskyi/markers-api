/*
  Warnings:

  - You are about to drop the column `last_name` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `GroupUsers` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `created_at` on table `Markers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Markers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `PublicFiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `PublicFiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `UserSessions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `UserSessions` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `last_mame` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "GroupUsers" DROP CONSTRAINT "GroupUsers_group_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupUsers" DROP CONSTRAINT "GroupUsers_user_id_fkey";

-- AlterTable
ALTER TABLE "Markers" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PublicFiles" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserSessions" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "last_name",
ADD COLUMN     "last_mame" VARCHAR(255) NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "GroupUsers";

-- CreateTable
CREATE TABLE "GroupsOnUsers" (
    "user_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupsOnUsers_pkey" PRIMARY KEY ("user_id","group_id")
);

-- AddForeignKey
ALTER TABLE "Markers" ADD CONSTRAINT "Markers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GroupsOnUsers" ADD CONSTRAINT "GroupsOnUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GroupsOnUsers" ADD CONSTRAINT "GroupsOnUsers_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
