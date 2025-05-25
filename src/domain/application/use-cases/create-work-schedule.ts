import { Either, right } from "@/core/either";
import { WorkScheduleRepository } from "@/domain/application/repositories/work-schedule-repository";
import { WorkSchedule } from "@/domain/entities/work-schedule";
import {
  BreakType,
  Weekday,
  WorkScheduleDay,
} from "@/domain/entities/work-schedule-day";
import { Injectable } from "@nestjs/common";

interface CreateWorkScheduleUseCaseRequest {
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

type CreateWorkScheduleUseCaseResponse = Either<
  null,
  { workSchedule: WorkSchedule }
>;

@Injectable()
export class CreateWorkScheduleUseCase {
  constructor(private workScheduleRepository: WorkScheduleRepository) {}

  async execute({
    name,
    companyId,
    days,
  }: CreateWorkScheduleUseCaseRequest): Promise<CreateWorkScheduleUseCaseResponse> {
    this.validateWorkScheduleDays(days);

    const workSchedule = WorkSchedule.create({
      name,
      companyId,
      days: days.map((day) =>
        WorkScheduleDay.create({
          weekday: day.weekday,
          startTime: day.startTime,
          endTime: day.endTime,
          totalWorkMinutes: day.totalWorkMinutes,
          breakType: day.breakType,
          breakStartWindow: day.breakStartWindow,
          breakEndWindow: day.breakEndWindow,
          breakDuration: day.breakDuration,
          workScheduleId: "",
        })
      ),
    });

    await this.workScheduleRepository.create(workSchedule);

    return right({ workSchedule });
  }

  private validateWorkScheduleDays(
    days: CreateWorkScheduleUseCaseRequest["days"]
  ): void {
    if (days.length === 0) {
      throw new Error(
        "O horário de trabalho deve ter pelo menos um dia configurado"
      );
    }

    const weekdays = days.map((day) => day.weekday);
    const uniqueWeekdays = new Set(weekdays);
    if (uniqueWeekdays.size !== weekdays.length) {
      throw new Error(
        "Não é permitido ter dias duplicados no horário de trabalho"
      );
    }

    days.forEach((day) => {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(day.startTime) || !timeRegex.test(day.endTime)) {
        throw new Error("Formato de horário inválido. Use o formato HH:mm");
      }

      const startTime = new Date(`2000-01-01T${day.startTime}`);
      const endTime = new Date(`2000-01-01T${day.endTime}`);
      if (startTime >= endTime) {
        throw new Error(
          "O horário de início deve ser menor que o horário de fim"
        );
      }

      if (day.breakType !== "NONE") {
        if (
          !day.breakStartWindow ||
          !day.breakEndWindow ||
          !day.breakDuration
        ) {
          throw new Error(
            "Para intervalos, é necessário informar janela de início, fim e duração"
          );
        }

        if (
          !timeRegex.test(day.breakStartWindow) ||
          !timeRegex.test(day.breakEndWindow)
        ) {
          throw new Error(
            "Formato de horário inválido para intervalo. Use o formato HH:mm"
          );
        }

        const breakStart = new Date(`2000-01-01T${day.breakStartWindow}`);
        const breakEnd = new Date(`2000-01-01T${day.breakEndWindow}`);
        if (breakStart >= breakEnd) {
          throw new Error(
            "A janela de início do intervalo deve ser menor que a janela de fim"
          );
        }
      }
    });
  }
}
