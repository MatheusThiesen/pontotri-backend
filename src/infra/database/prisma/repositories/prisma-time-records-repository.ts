import {
  TimeRecordFindMany,
  TimeRecordsRepository,
} from "@/domain/application/repositories/time-records-repository";
import { TimeRecord, TimeRecordFilter } from "@/domain/entities/time-record";
import { Injectable } from "@nestjs/common";
import { PrismaTimeRecordMapper } from "../mappers/prisma-time-record-mapper";
import { PrismaService } from "../prisma.service";
import {
  WhereFieldProps,
  WhereFilterPrisma,
} from "../utils/where-filter-prisma.utils";

@Injectable()
export class PrismaTimeRecordsRepository implements TimeRecordsRepository {
  constructor(
    private prisma: PrismaService,
    private toWhere: WhereFilterPrisma
  ) {}

  readonly fieldsWhere: WhereFieldProps[] = [
    {
      name: "userId",
      type: "string",
      exact: true,
    },
  ];

  async findManyByCompanyId(
    companyId: string,
    { page, pagesize, filters }: TimeRecordFindMany
  ): Promise<TimeRecord[]> {
    const timeRecord = (await this.prisma.timeRecord.findMany({
      include: { location: true, user: { omit: { profileImage: true } } },
      omit: { photoUrl: true },
      orderBy: {
        createdAt: "desc",
      },
      take: pagesize,
      skip: (page - 1) * pagesize,
      where: { companyId, ...this.toWhere.execute(filters, this.fieldsWhere) },
    })) as any;

    return timeRecord.map(PrismaTimeRecordMapper.toDomain);
  }
  async countByCompanyId(
    companyId: string,
    filters: TimeRecordFilter
  ): Promise<number> {
    return await this.prisma.timeRecord.count({
      where: { companyId, ...this.toWhere.execute(filters, this.fieldsWhere) },
    });
  }
  async create(timeRecord: TimeRecord): Promise<void> {
    const data = PrismaTimeRecordMapper.toPrisma(timeRecord);

    await this.prisma.timeRecord.create({
      data,
    });
  }
  async findById(id: string): Promise<TimeRecord | null> {
    const timeRecord = await this.prisma.timeRecord.findUnique({
      where: { id },
      include: { location: true, user: true },
    });

    if (!timeRecord) return null;

    return PrismaTimeRecordMapper.toDomain(timeRecord);
  }
  async findOpenByUserId(userId: string): Promise<TimeRecord | null> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const timeRecord = await this.prisma.timeRecord.findFirst({
      orderBy: { createdAt: "desc" },
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: { location: true, user: true },
    });

    if (!timeRecord) return null;

    return PrismaTimeRecordMapper.toDomain(timeRecord);
  }
  async save(timeRecord: TimeRecord): Promise<void> {
    const data = PrismaTimeRecordMapper.toPrisma(timeRecord);

    await this.prisma.timeRecord.update({
      where: { id: data.id },
      data,
    });
  }
}
