/*
  Warnings:

  - Made the column `ownerId` on table `Content` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_ownerId_fkey";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "ownerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
