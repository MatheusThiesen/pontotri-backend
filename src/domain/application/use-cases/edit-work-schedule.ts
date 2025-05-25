import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { WorkSchedule } from "@/domain/entities/work-schedule";
import { WorkScheduleDay } from "@/domain/entities/work-schedule-day";
import { Injectable } from "@nestjs/common";
import { WorkScheduleRepository } from "../repositories/work-schedule-repository";

interface EditWorkScheduleUseCaseRequest {
  id: string;
  name?: string;
  days?: {
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
  { workSchedule: WorkSchedule }
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
        WorkScheduleDay.create({
          weekday: day.weekday as any,
          startTime: day.startTime,
          endTime: day.endTime,
          totalWorkMinutes: day.totalWorkMinutes,
          breakType: day.breakType as any,
          breakStartWindow: day.breakStartWindow,
          breakEndWindow: day.breakEndWindow,
          breakDuration: day.breakDuration,
          workScheduleId: id,
        })
      );
    }

    await this.workScheduleRepository.save(workSchedule);

    return right({ workSchedule });
  }
}
