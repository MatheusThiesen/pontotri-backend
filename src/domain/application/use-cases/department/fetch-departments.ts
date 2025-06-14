import { Either, left, right } from "@/core/either";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { Department } from "@/domain/entities/department";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users-repository";

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
  constructor(
    private departmentRepository: DepartmentsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    page,
    pagesize,
  }: FetchDepartmentsUseCaseRequest): Promise<FetchDepartmentsUseCaseResponse> {
    const getUser = await this.usersRepository.findById(userId);
    if (!getUser || !getUser.companyId) return left(null);

    const [departments, total] = await Promise.all([
      this.departmentRepository.findManyByCompanyId(getUser.companyId, {
        page,
        pagesize,
      }),
      this.departmentRepository.countByCompanyId(getUser.companyId),
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
