import { Either, left, right } from "@/core/either";
import { User } from "@/domain/entities/user";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users-repository";
import { WrongCredentialsError } from "../errors/wrong-credentials-error";

interface GetUserUseCaseRequest {
  userId: string;
}

type GetUserUseCaseResponse = Either<WrongCredentialsError, User>;

@Injectable()
export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    return right(user);
  }
}
