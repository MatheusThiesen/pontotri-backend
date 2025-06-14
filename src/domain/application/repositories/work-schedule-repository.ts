import { PaginationParams } from "@/core/repositories/pagination-params";
import { WorkSchedule } from "@/domain/entities/work-schedule";
import { BreakType, Weekday } from "@/domain/entities/work-schedule-day";

export interface CreateWorkScheduleData {
  name: string;
  companyId: string;
  days: {
    weekday: Weekday;
    startTime: string;
    endTime: string;
    totalWorkMinutes: number;
    breakType: BreakType;
    breakStartWindow?: string;
    breakEndWindow?: string;
    breakDuration?: number;
  }[];
}

export abstract class WorkScheduleRepository {
  abstract create(workSchedule: WorkSchedule): Promise<void>;
  abstract findById(id: string): Promise<WorkSchedule | null>;
  abstract findManyByCompanyId(
    companyId: string,
    params: PaginationParams
  ): Promise<WorkSchedule[]>;
  abstract countByCompanyId(companyId: string): Promise<number>;
  abstract save(workSchedule: WorkSchedule): Promise<WorkSchedule>;
  abstract delete(id: string): Promise<void>;
}
