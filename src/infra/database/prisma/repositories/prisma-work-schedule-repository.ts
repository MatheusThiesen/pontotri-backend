import { WorkScheduleRepository } from "@/domain/application/repositories/work-schedule-repository";
import { WorkSchedule } from "@/domain/entities/work-schedule";
import { WorkScheduleDayList } from "@/domain/entities/work-schedule-day-list";
import { Injectable } from "@nestjs/common";
import { PrismaWorkScheduleDayMapper } from "../mappers/prisma-work-schedule-day-mapper";
import { PrismaWorkScheduleMapper } from "../mappers/prisma-work-schedule-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaWorkScheduleRepository implements WorkScheduleRepository {
  constructor(private prisma: PrismaService) {}

  async create(workSchedule: WorkSchedule): Promise<void> {
    const data = PrismaWorkScheduleMapper.toPrisma(workSchedule);
    await this.prisma.workSchedule.create({ data });
  }

  async findById(id: string): Promise<WorkSchedule | null> {
    const workSchedule = await this.prisma.workSchedule.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        companyId: true,
        updatedAt: true,
        createdAt: true,
        days: {
          select: {
            id: true,
            weekday: true,
            startTime: true,
            endTime: true,
            totalWorkMinutes: true,
            breakType: true,
            breakStartWindow: true,
            breakEndWindow: true,
            breakDuration: true,
            workScheduleId: true,
          },
        },
      },
    });

    if (!workSchedule) return null;

    return PrismaWorkScheduleMapper.toDomain(workSchedule);
  }

  async findByCompanyId(companyId: string): Promise<WorkSchedule[]> {
    const workSchedules = await this.prisma.workSchedule.findMany({
      where: { companyId },
      include: {
        days: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return workSchedules.map(PrismaWorkScheduleMapper.toDomain);
  }

  async countByCompanyId(companyId: string): Promise<number> {
    const total = await this.prisma.workSchedule.count({
      where: { companyId },
    });

    return total;
  }

  async save(workSchedule: WorkSchedule): Promise<WorkSchedule> {
    const getAllDays = await this.prisma.workScheduleDay.findMany({
      where: {
        workScheduleId: workSchedule.id.toString(),
      },
    });

    const days = new WorkScheduleDayList(
      getAllDays.map(PrismaWorkScheduleDayMapper.toDomain)
    );

    days.update(workSchedule.days);

    if (days.getNewItems().length > 0) {
      await this.prisma.workScheduleDay.createMany({
        data: days.getNewItems().map(PrismaWorkScheduleDayMapper.toPrisma),
      });
    }

    if (days.getUpdatedItems().length > 0) {
      for (const day of days.getUpdatedItems()) {
        await this.prisma.workScheduleDay.update({
          where: { id: day.id.toString() },
          data: PrismaWorkScheduleDayMapper.toPrisma(day),
        });
      }
    }

    if (days.getRemovedItems().length > 0) {
      for (const day of days.getRemovedItems()) {
        await this.prisma.workScheduleDay.delete({
          where: { id: day.id.toString() },
        });
      }
    }

    const updated = await this.prisma.workSchedule.update({
      where: { id: workSchedule.id.toString() },
      data: PrismaWorkScheduleMapper.toPrismaSave(workSchedule),
      include: { days: true },
    });
    return PrismaWorkScheduleMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.workSchedule.delete({
      where: { id },
    });
  }
}
