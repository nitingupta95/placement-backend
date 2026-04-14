/*
  Warnings:

  - You are about to drop the column `designation` on the `CollegeAdmin` table. All the data in the column will be lost.
  - You are about to drop the column `legalDocsUrl` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Student` table. All the data in the column will be lost.
  - The `permissions` column on the `SuperAdmin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `noOfSeats` to the `JobPosting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('MANAGE_COLLEGE_VERIFICATION', 'MANAGE_COMPANY_VERIFICATION', 'MANAGE_ALL_USERS', 'VIEW_GLOBAL_ANALYTICS', 'DELETE_JOB_POSTINGS', 'MANAGE_ADMIN_ACCOUNTS');

-- CreateEnum
CREATE TYPE "LegalDocType" AS ENUM ('AADHAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID', 'OTHER');

-- AlterTable
ALTER TABLE "CollegeAdmin" DROP COLUMN "designation",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "superAdminId" INTEGER;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "superAdminId" INTEGER;

-- AlterTable
ALTER TABLE "JobPosting" ADD COLUMN     "noOfSeats" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "legalDocsUrl",
DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "legalDocType" "LegalDocType",
ADD COLUMN     "legalDocUrl" TEXT,
ADD COLUMN     "superAdminId" INTEGER;

-- AlterTable
ALTER TABLE "SuperAdmin" DROP COLUMN "permissions",
ADD COLUMN     "permissions" "Permission"[];

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeAdmin" ADD CONSTRAINT "CollegeAdmin_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "SuperAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
