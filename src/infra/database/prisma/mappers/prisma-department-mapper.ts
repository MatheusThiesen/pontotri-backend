import { Department } from "@/domain/entities/department";
import { Prisma, Department as PrismaDepartment } from "@prisma/client";

export class PrismaDepartmentMapper {
  static toDomain(raw: PrismaDepartment): Department {
    return Department.create(
      {
        name: raw.name,
        companyId: raw.companyId,
      },
      raw.id
    );
  }

  static toPrisma(
    department: Department
  ): Prisma.DepartmentUncheckedCreateInput {
    return {
      id: department.id.toString(),
      name: department.name,
      companyId: department.companyId,
    };
  }
}
