/*
  Warnings:

  - Added the required column `companyId` to the `work_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BreakType" AS ENUM ('NONE', 'FIXED', 'FLEXIBLE');

-- AlterTable
ALTER TABLE "work_schedule_days" ADD COLUMN     "breakType" "BreakType" NOT NULL DEFAULT 'NONE',
ALTER COLUMN "breakStartWindow" DROP NOT NULL,
ALTER COLUMN "breakEndWindow" DROP NOT NULL,
ALTER COLUMN "breakDuration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "work_schedules" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "work_schedules" ADD CONSTRAINT "work_schedules_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
