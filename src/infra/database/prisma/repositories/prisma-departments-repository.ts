import { PaginationParams } from "@/core/repositories/pagination-params";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { Department } from "@/domain/entities/department";
import { Injectable } from "@nestjs/common";
import { PrismaDepartmentMapper } from "../mappers/prisma-department-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaDepartmentsRepository implements DepartmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByCompanyId(
    companyId: string,
    { page, pagesize }: PaginationParams
  ): Promise<Department[]> {
    const departments = await this.prisma.department.findMany({
      take: pagesize,
      skip: (page - 1) * pagesize,
      where: { companyId },
    });

    return departments.map(PrismaDepartmentMapper.toDomain);
  }

  async countByCompanyId(companyId: string): Promise<number> {
    const total = await this.prisma.department.count({ where: { companyId } });

    return total;
  }

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

  async delete(department: Department): Promise<void> {
    await this.prisma.department.delete({
      where: { id: department.id.toString() },
    });
  }
}
