import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { Injectable } from "@nestjs/common";

interface DeleteDepartmentUseCaseRequest {
  id: string;
}

type DeleteDepartmentUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeleteDepartmentUseCase {
  constructor(private departmentRepository: DepartmentsRepository) {}

  async execute({
    id,
  }: DeleteDepartmentUseCaseRequest): Promise<DeleteDepartmentUseCaseResponse> {
    const department = await this.departmentRepository.findById(id);

    if (!department) {
      return left(new ResourceNotFoundError());
    }

    await this.departmentRepository.delete(department);

    return right(null);
  }
}
