import { Either, right } from "@/core/either";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { WorkSchedule } from "@/domain/entities/work-schedule";
import { Injectable } from "@nestjs/common";
import { WorkScheduleRepository } from "../../repositories/work-schedule-repository";

interface FetchWorkSchedulesUseCaseRequest extends PaginationParams {
  companyId: string;
}

type FetchWorkSchedulesUseCaseResponse = Either<
  null,
  {
    workSchedules: WorkSchedule[];
    pagination: {
      total: number;
      page: number;
      pagesize: number;
    };
  }
>;

@Injectable()
export class FetchWorkSchedulesUseCase {
  constructor(private workScheduleRepository: WorkScheduleRepository) {}

  async execute({
    companyId,
    page,
    pagesize,
  }: FetchWorkSchedulesUseCaseRequest): Promise<FetchWorkSchedulesUseCaseResponse> {
    const [workSchedules, total] = await Promise.all([
      this.workScheduleRepository.findByCompanyId(companyId),
      this.workScheduleRepository.countByCompanyId(companyId),
    ]);

    return right({
      workSchedules,
      pagination: {
        total,
        page,
        pagesize,
      },
    });
  }
}
