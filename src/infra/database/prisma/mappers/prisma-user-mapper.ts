import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User } from "@/domain/entities/user";
import { Prisma, User as PrismaUser } from "@prisma/client";

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role,
        isActive: raw.isActive,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        companyId: raw.companyId ?? undefined,
        departmentId: raw.departmentId ?? undefined,
        workScheduleId: raw.workScheduleId ?? undefined,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      companyId: user.companyId,
      departmentId: user.departmentId,
      workScheduleId: user.workScheduleId,
    };
  }
}
