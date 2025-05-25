import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { User } from "@/domain/entities/user";
import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";

interface EditUserUseCaseRequest {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  isActive?: boolean;
  companyId?: string;
  departmentId?: string;
  workScheduleId?: string;
  profileImage?: string;
}

type EditUserUseCaseResponse = Either<
  ResourceNotFoundError | UserAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class EditUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    name,
    email,
    password,
    role,
    isActive,
    companyId,
    departmentId,
    workScheduleId,
    profileImage,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    if (email && email !== user.email) {
      const userWithSameEmail = await this.usersRepository.findByEmail(email);

      if (userWithSameEmail) {
        return left(new UserAlreadyExistsError(email));
      }

      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = password;
    }

    if (role) {
      user.role = role;
    }

    if (typeof isActive === "boolean") {
      user.isActive = isActive;
    }

    if (companyId !== undefined) {
      user.companyId = companyId;
    }

    if (departmentId !== undefined) {
      user.departmentId = departmentId;
    }

    if (workScheduleId !== undefined) {
      user.workScheduleId = workScheduleId;
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await this.usersRepository.save(user);

    return right({
      user,
    });
  }
}
