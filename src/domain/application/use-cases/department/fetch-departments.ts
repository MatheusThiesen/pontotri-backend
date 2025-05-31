import { Either, right } from "@/core/either";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { Department } from "@/domain/entities/department";
import { Injectable } from "@nestjs/common";

interface FetchDepartmentsUseCaseRequest {
  userId: string;
  page: number;
  pagesize: number;
}

type FetchDepartmentsUseCaseResponse = Either<
  null,
  {
    departments: Department[];
    pagination: {
      page: number;
      pagesize: number;
      total: number;
    };
  }
>;

@Injectable()
export class FetchDepartmentsUseCase {
  constructor(private departmentRepository: DepartmentsRepository) {}

  async execute({
    userId,
    page,
    pagesize,
  }: FetchDepartmentsUseCaseRequest): Promise<FetchDepartmentsUseCaseResponse> {
    console.log(userId);

    const [departments, total] = await Promise.all([
      this.departmentRepository.findMany({ page, pagesize }),
      this.departmentRepository.count(),
    ]);

    return right({
      departments,
      pagination: {
        total,
        page,
        pagesize,
      },
    });
  }
}
