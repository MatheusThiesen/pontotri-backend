-- DropForeignKey
ALTER TABLE "time_records" DROP CONSTRAINT "time_records_workScheduleId_fkey";

-- AlterTable
ALTER TABLE "time_records" ALTER COLUMN "workScheduleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "time_records" ADD CONSTRAINT "time_records_workScheduleId_fkey" FOREIGN KEY ("workScheduleId") REFERENCES "work_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
