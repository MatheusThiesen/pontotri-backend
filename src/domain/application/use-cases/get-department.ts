import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { Department } from "@/domain/entities/department";
import { Injectable } from "@nestjs/common";

interface GetDepartmentUseCaseRequest {
  departmentId: string;
}

type GetDepartmentUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    department: Department;
  }
>;

@Injectable()
export class GetDepartmentUseCase {
  constructor(private departmentsRepository: DepartmentsRepository) {}

  async execute({
    departmentId,
  }: GetDepartmentUseCaseRequest): Promise<GetDepartmentUseCaseResponse> {
    const department = await this.departmentsRepository.findById(departmentId);

    if (!department) return left(new ResourceNotFoundError("department"));

    return right({ department });
  }
}
