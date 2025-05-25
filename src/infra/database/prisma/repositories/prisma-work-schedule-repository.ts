import { WorkScheduleRepository } from "@/domain/application/repositories/work-schedule-repository";
import { WorkSchedule } from "@/domain/entities/work-schedule";
import { Injectable } from "@nestjs/common";
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
      include: {
        days: true,
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

  async save(workSchedule: WorkSchedule): Promise<void> {
    const data = PrismaWorkScheduleMapper.toPrisma(workSchedule);
    await this.prisma.workSchedule.update({
      where: { id: workSchedule.id.toString() },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.workSchedule.delete({
      where: { id },
    });
  }
}
