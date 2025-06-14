import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { TimeRecord, TimeRecordFilter } from "@/domain/entities/time-record";
import { Injectable } from "@nestjs/common";
import {
  TimeRecordFindMany,
  TimeRecordsRepository,
} from "../../repositories/time-records-repository";
import { UsersRepository } from "../../repositories/users-repository";

interface FetchTimeRecordsUseCaseRequest extends TimeRecordFindMany {
  page: number;
  pagesize: number;
  userId: string;
  filters?: TimeRecordFilter;
}

type FetchTimeRecordsUseCaseResponse = Either<
  ResourceNotFoundError | null,
  {
    timeRecords: TimeRecord[];
    pagination: {
      page: number;
      pagesize: number;
      total: number;
    };
  }
>;

@Injectable()
export class FetchTimeRecordsUseCase {
  constructor(
    private timeRecordsRepository: TimeRecordsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    page,
    pagesize,
    filters,
  }: FetchTimeRecordsUseCaseRequest): Promise<FetchTimeRecordsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user?.companyId) return left(new ResourceNotFoundError());

    const [timeRecords, total] = await Promise.all([
      this.timeRecordsRepository.findManyByCompanyId(user.companyId, {
        page,
        pagesize,
        filters: {
          ...filters,
          userId:
            user.role === "EMPLOYEE" ? user.id.toString() : filters?.userId,
        },
      }),
      this.timeRecordsRepository.countByCompanyId(user.companyId, {
        ...filters,
        userId: user.role === "EMPLOYEE" ? user.id.toString() : filters?.userId,
      }),
    ]);

    return right({
      timeRecords,
      pagination: {
        total,
        page,
        pagesize,
      },
    });
  }
}
