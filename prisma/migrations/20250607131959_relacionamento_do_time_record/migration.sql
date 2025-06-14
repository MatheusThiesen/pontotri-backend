/*
  Warnings:

  - Added the required column `companyId` to the `time_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workScheduleId` to the `time_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "time_records" ADD COLUMN     "companyId" TEXT NOT NULL,
ADD COLUMN     "locationId" TEXT,
ADD COLUMN     "workScheduleId" TEXT NOT NULL,
ALTER COLUMN "photoUrl" DROP NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "time_records" ADD CONSTRAINT "time_records_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_records" ADD CONSTRAINT "time_records_workScheduleId_fkey" FOREIGN KEY ("workScheduleId") REFERENCES "work_schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_records" ADD CONSTRAINT "time_records_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
