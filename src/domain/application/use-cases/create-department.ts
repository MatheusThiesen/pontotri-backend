import { Either, right } from "@/core/either";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { Department } from "@/domain/entities/department";
import { Injectable } from "@nestjs/common";

interface CreateDepartmentUseCaseRequest {
  name: string;
  companyId: string;
}

type CreateDepartmentUseCaseResponse = Either<
  null,
  {
    department: Department;
  }
>;

@Injectable()
export class CreateDepartmentUseCase {
  constructor(private departmentsRepository: DepartmentsRepository) {}

  async execute({
    name,
    companyId,
  }: CreateDepartmentUseCaseRequest): Promise<CreateDepartmentUseCaseResponse> {
    const department = Department.create({ name, companyId });

    await this.departmentsRepository.create(department);

    return right({ department });
  }
}
