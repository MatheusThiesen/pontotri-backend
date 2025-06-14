import { Either, left, right } from "@/core/either";
import { TimeRecordType } from "@/domain/entities/time-record";
import { WorkSchedule } from "@/domain/entities/work-schedule";
import { Weekday } from "@/domain/entities/work-schedule-day";
import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";

interface DefineNextTypeTimeRecordUseCaseRequest {
  currentType?: TimeRecordType;
  workSchedule?: WorkSchedule;
}

type DefineNextTypeTimeRecordUseCaseResponse = Either<null, TimeRecordType>;

@Injectable()
export class DefineNextTypeTimeRecordUseCase {
  private readonly weekdayMap: Weekday[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  async execute({
    workSchedule,
    currentType,
  }: DefineNextTypeTimeRecordUseCaseRequest): Promise<DefineNextTypeTimeRecordUseCaseResponse> {
    if (currentType === "EXIT") {
      return left(null);
    }

    const todayWeekday = this.weekdayMap[dayjs().day()];
    const todaySchedule = workSchedule?.days.find(
      (day) => day.weekday === todayWeekday
    );

    // Nenhuma batida ainda
    if (!currentType) {
      return right("ENTRY");
    }

    // Se não tiver escala ou não tiver intervalo, pula direto pra EXIT
    const noBreak =
      !workSchedule || !todaySchedule || todaySchedule.breakType === "NONE";

    if (noBreak) {
      return right("EXIT");
    }

    // Se há intervalo, segue a sequência de tipos
    switch (currentType) {
      case "ENTRY":
        return right("BREAK_START");
      case "BREAK_START":
        return right("BREAK_END");
      case "BREAK_END":
        return right("EXIT");
      default:
        return left(null);
    }
  }
}
