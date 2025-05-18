import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { Injectable } from "@nestjs/common";

interface EditDepartmentUseCaseRequest {
  departmentId: string;
  name: string;
}

type EditDepartmentUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class EditDepartmentUseCase {
  constructor(private departmentsRepository: DepartmentsRepository) {}

  async execute({
    departmentId,
    name,
  }: EditDepartmentUseCaseRequest): Promise<EditDepartmentUseCaseResponse> {
    const department = await this.departmentsRepository.findById(departmentId);

    if (!department) return left(new ResourceNotFoundError("department"));

    department.name = name;
    await this.departmentsRepository.save(department);

    return right(null);
  }
}
