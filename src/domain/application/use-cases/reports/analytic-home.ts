import { Either, left, right } from "@/core/either";
import { TimeRecordType } from "@/domain/entities/time-record";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";

type AnalyticHomeUseCaseRequest = {
  userId: string;
};

type AnalyticHomeUseCaseResponse = Either<null, AnalyticHomeProps>;

type AnalyticHomeProps = {
  lastRecords: { date: Date; type: TimeRecordType }[];
  nextDays: { date: Date; isWorker: boolean; hours?: string }[];
  totalHours: number;
  monthDays: {
    present: number;
    days: number;
    percentage: number;
  };
};

@Injectable()
export class AnalyticHomeUseCase {
  constructor(private prisma: PrismaService) {}

  async execute({
    userId,
  }: AnalyticHomeUseCaseRequest): Promise<AnalyticHomeUseCaseResponse> {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        workSchedule: {
          select: {
            days: {
              select: {
                weekday: true,
                startTime: true,
                endTime: true,
              },
            },
          },
        },
      },
      where: { id: userId },
    });
    if (!user) return left(null);

    const startOfMonth = dayjs().startOf("month").toDate();
    const endOfMonth = dayjs().endOf("month").toDate();

    const records = await this.prisma.timeRecord.findMany({
      select: {
        id: true,
        createdAt: true,
        type: true,
      },
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    const days = await this.prisma.calendarDay.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
    const nextDays = await this.prisma.calendarDay.findMany({
      where: {
        date: {
          gte: dayjs().startOf("day").toDate(),
          lte: dayjs().add(6, "day").endOf("day").toDate(),
        },
      },
    });
    const lastRecords = await this.prisma.timeRecord.findMany({
      select: {
        id: true,
        createdAt: true,
        type: true,
      },
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 7,
    });

    const totalHours = records.reduce((acc, record, index, array) => {
      const nextRecord = array[index + 1];

      if (
        record.type === "ENTRY" &&
        ["EXIT", "BREAK_START"].includes(nextRecord?.type)
      ) {
        const entryTime = dayjs(record.createdAt);
        const exitTime = dayjs(nextRecord.createdAt);
        const hoursWorked = exitTime.diff(entryTime, "hour", true);

        return acc + hoursWorked;
      }

      if (record.type === "BREAK_END" && nextRecord?.type === "EXIT") {
        const exitBreakTime = dayjs(record.createdAt);
        const exitTime = dayjs(nextRecord.createdAt);
        const hoursWorked = exitTime.diff(exitBreakTime, "hour", true);

        return acc + hoursWorked;
      }

      return acc;
    }, 0);

    const monthDays = days.reduce(
      (acc, record) => {
        const dayWorkSchedule = user.workSchedule?.days.find(
          (weekdayDay) => record.weekday === weekdayDay.weekday
        );

        if (!!dayWorkSchedule) {
          acc.days += 1;
        }

        if (
          records.some((rec) => dayjs(rec.createdAt).isSame(record.date, "day"))
        ) {
          acc.present += 1;
        }

        return acc;
      },
      { present: 0, days: 0 }
    );

    return right({
      lastRecords: lastRecords.map((record) => ({
        date: record.createdAt,
        type: record.type,
      })),
      nextDays: nextDays.map((day) => {
        const dayWorkSchedule = user.workSchedule?.days.find(
          (weekdayDay) => day.weekday === weekdayDay.weekday
        );

        return {
          date: day.date,
          isWorker: !!dayWorkSchedule,
          hours: dayWorkSchedule
            ? `${dayWorkSchedule?.startTime} - ${dayWorkSchedule?.endTime}`
            : undefined,
        };
      }),
      totalHours: totalHours,
      monthDays: {
        ...monthDays,
        percentage: Number(
          ((monthDays.present / monthDays.days) * 100).toFixed(0)
        ),
      },
    });
  }
}
