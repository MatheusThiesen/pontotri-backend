import { Either, right } from "@/core/either";
import { Department } from "@/domain/entities/department";
import { Injectable } from "@nestjs/common";
import { DepartmentsRepository } from "../../repositories/departments-repository";

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
  constructor(private departmentRepository: DepartmentsRepository) {}

  async execute({
    name,
    companyId,
  }: CreateDepartmentUseCaseRequest): Promise<CreateDepartmentUseCaseResponse> {
    const department = Department.create({
      name,
      companyId,
    });

    await this.departmentRepository.create(department);

    return right({
      department,
    });
  }
}
