/*
  Warnings:

  - Made the column `summary` on table `Blogs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Blogs" ALTER COLUMN "summary" SET NOT NULL,
ALTER COLUMN "coverImage" DROP NOT NULL;
