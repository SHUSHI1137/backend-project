/*
  Warnings:

  - You are about to drop the column `thumbnaiRul` on the `Content` table. All the data in the column will be lost.
  - Added the required column `thumbnaiUrl` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" DROP COLUMN "thumbnaiRul",
ADD COLUMN     "thumbnaiUrl" VARCHAR(255) NOT NULL;
