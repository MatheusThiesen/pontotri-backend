import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { WorkScheduleDay } from "@/domain/entities/work-schedule-day";
import {
  Prisma,
  WorkScheduleDay as PrismaWorkScheduleDay,
} from "@prisma/client";

export class PrismaWorkScheduleDayMapper {
  static toDomain(raw: PrismaWorkScheduleDay): WorkScheduleDay {
    return WorkScheduleDay.create(
      {
        weekday: raw.weekday as any,
        startTime: raw.startTime,
        endTime: raw.endTime,
        totalWorkMinutes: raw.totalWorkMinutes,
        breakType: raw.breakType,
        breakStartWindow: raw.breakStartWindow ?? undefined,
        breakEndWindow: raw.breakEndWindow ?? undefined,
        breakDuration: raw.breakDuration ?? undefined,
        workScheduleId: raw.workScheduleId,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    workScheduleDay: WorkScheduleDay
  ): Prisma.WorkScheduleDayUncheckedCreateInput {
    return {
      workScheduleId: workScheduleDay.workScheduleId,
      weekday: workScheduleDay.weekday,
      startTime: workScheduleDay.startTime,
      endTime: workScheduleDay.endTime,
      totalWorkMinutes: workScheduleDay.totalWorkMinutes,
      breakType: workScheduleDay.breakType,
      breakStartWindow: workScheduleDay.breakStartWindow ?? null,
      breakEndWindow: workScheduleDay.breakEndWindow ?? null,
      breakDuration: workScheduleDay.breakDuration ?? null,
    };
  }
}
