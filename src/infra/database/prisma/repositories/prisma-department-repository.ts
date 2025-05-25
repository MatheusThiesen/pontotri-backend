import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { Department } from "@/domain/entities/department";
import { Injectable } from "@nestjs/common";
import { PrismaDepartmentMapper } from "../mappers/prisma-department-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaDepartmentRepository implements DepartmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(department: Department): Promise<void> {
    const data = PrismaDepartmentMapper.toPrisma(department);

    await this.prisma.department.create({
      data,
    });
  }

  async findById(id: string): Promise<Department | null> {
    const department = await this.prisma.department.findUnique({
      where: {
        id,
      },
    });

    if (!department) {
      return null;
    }

    return PrismaDepartmentMapper.toDomain(department);
  }

  async save(department: Department): Promise<void> {
    const data = PrismaDepartmentMapper.toPrisma(department);

    await this.prisma.department.update({
      where: {
        id: department.id.toString(),
      },
      data,
    });
  }

  async findManyByCompanyId(
    companyId: string,
    page: number,
    pagesize: number
  ): Promise<Department[]> {
    const departments = await this.prisma.department.findMany({
      where: {
        companyId,
      },
      take: pagesize,
      skip: (page - 1) * pagesize,
    });

    return departments.map(PrismaDepartmentMapper.toDomain);
  }
}
