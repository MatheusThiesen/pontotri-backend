import { Either, right } from "@/core/either";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { Department } from "@/domain/entities/department";
import { Injectable } from "@nestjs/common";

interface FetchDepartmentsUseCaseRequest extends PaginationParams {
  companyId: string;
}

type FetchDepartmentsUseCaseResponse = Either<
  null,
  {
    departments: Department[];
  }
>;

@Injectable()
export class FetchDepartmentsUseCase {
  constructor(private departmentsRepository: DepartmentsRepository) {}

  async execute({
    companyId,
    page,
    pagesize,
  }: FetchDepartmentsUseCaseRequest): Promise<FetchDepartmentsUseCaseResponse> {
    const departments = await this.departmentsRepository.findManyByCompanyId(
      companyId,
      page,
      pagesize
    );

    return right({ departments });
  }
}
