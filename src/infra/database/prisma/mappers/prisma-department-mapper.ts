import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Department } from "@/domain/entities/department";
import { Prisma, Department as PrismaDepartment } from "@prisma/client";

export class PrismaDepartmentMapper {
  static toDomain(raw: PrismaDepartment): Department {
    return Department.create(
      {
        name: raw.name,
        companyId: raw.companyId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    department: Department
  ): Prisma.DepartmentUncheckedCreateInput {
    return {
      id: department.id.toString(),
      name: department.name,
      companyId: department.companyId,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    };
  }
}
