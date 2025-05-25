import { Either, left, right } from "@/core/either";
import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { User } from "@/domain/entities/user";
import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
  role?: Role;
  companyId?: string;
  departmentId?: string;
  workScheduleId?: string;
  profileImage?: string;
}

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    role = "EMPLOYEE",
    companyId,
    departmentId,
    workScheduleId,
    profileImage,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    const user = User.create({
      name,
      email,
      password,
      role,
      isActive: true,
      companyId,
      departmentId,
      workScheduleId,
      profileImage,
    });

    await this.usersRepository.create(user);

    return right({
      user,
    });
  }
}
