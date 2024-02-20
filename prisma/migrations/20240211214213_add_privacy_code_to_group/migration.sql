-- AlterTable
ALTER TABLE "Groups" ADD COLUMN     "description" VARCHAR(255) DEFAULT '',
ADD COLUMN     "privacy_code" VARCHAR(255) NOT NULL DEFAULT 'public',
ADD COLUMN     "title" VARCHAR(255) DEFAULT '';
