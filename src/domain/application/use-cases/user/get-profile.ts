import { Either, left, right } from "@/core/either";
import { User } from "@/domain/entities/user";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users-repository";
import { WrongCredentialsError } from "../errors/wrong-credentials-error";

interface GetProfileUseCaseRequest {
  userId: string;
}

type GetProfileUseCaseResponse = Either<WrongCredentialsError, Partial<User>>;

@Injectable()
export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    return right({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      companyId: user.companyId,
      departmentId: user.departmentId,
      workScheduleId: user.workScheduleId,
    });
  }
}
