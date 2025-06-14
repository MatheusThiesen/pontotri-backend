import { Either, left, right } from "@/core/either";
import { TimeRecordType } from "@/domain/entities/time-record";
import { BreakType, Weekday } from "@/domain/entities/work-schedule-day";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { UserPresenter } from "@/infra/http/presenters/user-presenter";
import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";
import { GetUserUseCase } from "../user/get-user";

type ReportTimeMirrorUseCaseRequest = {
  userId: string;
  dateStart: Date;
  dateEnd: Date;
};

type ReportTimeMirrorUseCaseResponse = Either<null, ReportTimeMirrorProps>;

type ReportTimeMirrorProps = {
  daysWithRecords: {
    date: Date;
    isWorker: boolean;
    records: { id: string; createdAt: Date; type: TimeRecordType }[];
  }[];
  recordColumns: TimeRecordType[];
  workSchedule?: {
    name: string;

    days?: {
      id: string;
      weekday: Weekday;
      startTime: string;
      endTime: string;
      breakType: BreakType;
      breakStartWindow: string | null;
      breakEndWindow: string | null;
      breakDuration: number | null;
    }[];
  };
};

@Injectable()
export class ReportTimeMirrorUseCase {
  constructor(
    private prisma: PrismaService,
    private getUserUseCase: GetUserUseCase
  ) {}

  async execute({
    userId,
    dateEnd,
    dateStart,
  }: ReportTimeMirrorUseCaseRequest): Promise<ReportTimeMirrorUseCaseResponse> {
    const user = await this.prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        workSchedule: {
          select: {
            name: true,
            days: {
              select: {
                id: true,
                weekday: true,
                startTime: true,
                breakStartWindow: true,
                breakEndWindow: true,
                endTime: true,
                breakDuration: true,
                breakType: true,
              },
            },
          },
        },
      },
      where: { id: userId },
    });
    if (!user) return left(null);

    const startDate = dayjs(dateStart).startOf("day").toDate();
    const endDate = dayjs(dateEnd).endOf("day").toDate();

    const days = await this.prisma.calendarDay.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const records = await this.prisma.timeRecord.findMany({
      select: {
        id: true,
        createdAt: true,
        type: true,
      },
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const daysWithRecords = days.map((day) => {
      const dayWorkSchedule = user.workSchedule?.days.find(
        (weekdayDay) => day.weekday === weekdayDay.weekday
      );

      const dayRecords = records.filter((record) =>
        dayjs(record.createdAt).isSame(day.date, "day")
      );

      return {
        date: day.date,
        isWorker: !!dayWorkSchedule,
        records: dayRecords.map((record) => ({
          id: record.id,
          createdAt: record.createdAt,
          type: record.type,
        })),
      };
    });

    const recordColumns: TimeRecordType[] = ["ENTRY", "EXIT"];

    if (user.workSchedule?.days.some((day) => day.breakType !== "NONE")) {
      recordColumns.push("BREAK_START", "BREAK_END");
    }

    const getUser = await this.getUserUseCase.execute({ userId: user.id });
    if (getUser.isLeft()) return left(null);

    return right({
      recordColumns,
      workSchedule: user.workSchedule ? user.workSchedule : undefined,
      daysWithRecords,
      user: UserPresenter.toHTTP(getUser.value),
    });
  }
}
