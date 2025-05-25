import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { WorkSchedule } from "@/domain/entities/work-schedule";
import { Injectable } from "@nestjs/common";
import { WorkScheduleRepository } from "../repositories/work-schedule-repository";

interface GetWorkScheduleUseCaseRequest {
  workScheduleId: string;
}

type GetWorkScheduleUseCaseResponse = Either<
  ResourceNotFoundError,
  { workSchedule: WorkSchedule }
>;

@Injectable()
export class GetWorkScheduleUseCase {
  constructor(private workScheduleRepository: WorkScheduleRepository) {}

  async execute({
    workScheduleId,
  }: GetWorkScheduleUseCaseRequest): Promise<GetWorkScheduleUseCaseResponse> {
    const workSchedule =
      await this.workScheduleRepository.findById(workScheduleId);

    if (!workSchedule) {
      return left(new ResourceNotFoundError());
    }

    return right({ workSchedule });
  }
}
