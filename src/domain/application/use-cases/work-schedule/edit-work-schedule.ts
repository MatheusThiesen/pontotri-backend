import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { WorkSchedule } from "@/domain/entities/work-schedule";
import { WorkScheduleDay } from "@/domain/entities/work-schedule-day";
import { Injectable } from "@nestjs/common";
import { WorkScheduleRepository } from "../../repositories/work-schedule-repository";

interface EditWorkScheduleUseCaseRequest {
  id: string;
  name?: string;
  days?: {
    id?: string;
    weekday: string;
    startTime: string;
    endTime: string;
    totalWorkMinutes: number;
    breakType: string;
    breakStartWindow?: string;
    breakEndWindow?: string;
    breakDuration?: number;
  }[];
}

type EditWorkScheduleUseCaseResponse = Either<
  ResourceNotFoundError,
  WorkSchedule
>;

@Injectable()
export class EditWorkScheduleUseCase {
  constructor(private workScheduleRepository: WorkScheduleRepository) {}

  async execute({
    id,
    name,
    days,
  }: EditWorkScheduleUseCaseRequest): Promise<EditWorkScheduleUseCaseResponse> {
    const workSchedule = await this.workScheduleRepository.findById(id);

    if (!workSchedule) {
      return left(new ResourceNotFoundError());
    }

    if (name) {
      workSchedule.name = name;
    }

    if (days) {
      workSchedule.days = days.map((day) =>
        WorkScheduleDay.create(
          {
            weekday: day.weekday as any,
            startTime: day.startTime,
            endTime: day.endTime,
            totalWorkMinutes: day.totalWorkMinutes,
            breakType: day.breakType as any,
            breakStartWindow: day.breakStartWindow,
            breakEndWindow: day.breakEndWindow,
            breakDuration: day.breakDuration,
            workScheduleId: id,
          },
          new UniqueEntityID(day.id)
        )
      );
    }

    const updated = await this.workScheduleRepository.save(workSchedule);

    return right(updated);
  }
}
