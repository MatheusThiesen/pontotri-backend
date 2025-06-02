import { Either, right } from "@/core/either";
import { PaginationParams } from "@/core/repositories/pagination-params";

import { User } from "@/domain/entities/user";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users-repository";

interface FetchUsersUseCaseRequest extends PaginationParams {
  companyId: string;
}

type FetchUsersUseCaseResponse = Either<
  null,
  {
    users: User[];
    pagination: {
      total: number;
      page: number;
      pagesize: number;
    };
  }
>;

@Injectable()
export class FetchUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    companyId,
    page,
    pagesize,
  }: FetchUsersUseCaseRequest): Promise<FetchUsersUseCaseResponse> {
    const [users, total] = await Promise.all([
      this.usersRepository.findManyByCompanyId(companyId, page, pagesize),
      this.usersRepository.countByCompanyId(companyId),
    ]);

    return right({
      users,
      pagination: {
        total,
        page,
        pagesize,
      },
    });
  }
}
