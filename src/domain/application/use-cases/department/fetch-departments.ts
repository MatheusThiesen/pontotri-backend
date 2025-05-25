import { Either, right } from "@/core/either";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { Department } from "@/domain/entities/department";
import { Injectable } from "@nestjs/common";

interface FetchDepartmentsUseCaseRequest {
  companyId: string;
  page: number;
  pagesize: number;
}

type FetchDepartmentsUseCaseResponse = Either<
  null,
  {
    departments: Department[];
  }
>;

@Injectable()
export class FetchDepartmentsUseCase {
  constructor(private departmentRepository: DepartmentsRepository) {}

  async execute({
    companyId,
    page,
    pagesize,
  }: FetchDepartmentsUseCaseRequest): Promise<FetchDepartmentsUseCaseResponse> {
    const departments = await this.departmentRepository.findManyByCompanyId(
      companyId,
      page,
      pagesize
    );

    return right({
      departments,
    });
  }
}
