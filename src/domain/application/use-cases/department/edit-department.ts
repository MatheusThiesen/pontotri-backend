import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { Department } from "@/domain/entities/department";
import { Injectable } from "@nestjs/common";

interface EditDepartmentUseCaseRequest {
  id: string;
  departmentId: string;
  name: string;
}

type EditDepartmentUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    department: Department;
  }
>;

@Injectable()
export class EditDepartmentUseCase {
  constructor(private departmentRepository: DepartmentsRepository) {}

  async execute({
    id,
    name,
  }: EditDepartmentUseCaseRequest): Promise<EditDepartmentUseCaseResponse> {
    const department = await this.departmentRepository.findById(id);

    if (!department) {
      return left(new ResourceNotFoundError());
    }

    department.name = name;

    await this.departmentRepository.save(department);

    return right({
      department,
    });
  }
}
