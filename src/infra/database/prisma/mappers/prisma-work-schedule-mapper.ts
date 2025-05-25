import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { WorkSchedule } from "@/domain/entities/work-schedule";
import { WorkScheduleDay } from "@/domain/entities/work-schedule-day";
import {
  Prisma,
  WorkSchedule as PrismaWorkSchedule,
  WorkScheduleDay as PrismaWorkScheduleDay,
} from "@prisma/client";

export class PrismaWorkScheduleMapper {
  static toDomain(
    raw: PrismaWorkSchedule & { days: PrismaWorkScheduleDay[] }
  ): WorkSchedule {
    return WorkSchedule.create(
      {
        name: raw.name,
        companyId: raw.companyId,
        days: raw.days.map((day) =>
          WorkScheduleDay.create({
            weekday: day.weekday,
            startTime: day.startTime,
            endTime: day.endTime,
            totalWorkMinutes: day.totalWorkMinutes,
            breakType: day.breakType,
            breakStartWindow: day.breakStartWindow ?? undefined,
            breakEndWindow: day.breakEndWindow ?? undefined,
            breakDuration: day.breakDuration ?? undefined,
            workScheduleId: day.workScheduleId,
          })
        ),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    workSchedule: WorkSchedule
  ): Prisma.WorkScheduleUncheckedCreateInput {
    return {
      name: workSchedule.name,
      companyId: workSchedule.companyId,
      days: {
        create: workSchedule.days.map((day) => ({
          weekday: day.weekday,
          startTime: day.startTime,
          endTime: day.endTime,
          totalWorkMinutes: day.totalWorkMinutes,
          breakType: day.breakType,
          breakStartWindow: day.breakStartWindow ?? null,
          breakEndWindow: day.breakEndWindow ?? null,
          breakDuration: day.breakDuration ?? null,
        })),
      },
    };
  }
}
