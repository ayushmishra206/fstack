/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `location` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(30)`.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "location" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "username" SET DATA TYPE VARCHAR(15);
