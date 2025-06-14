import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { Company } from "@/domain/entities/company";
import { Department } from "@/domain/entities/department";
import { User } from "@/domain/entities/user";
import { WorkSchedule } from "@/domain/entities/work-schedule";
import { Injectable } from "@nestjs/common";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const findUser = await this.prisma.user.findUnique({
      include: { department: true, workSchedule: true, company: true },
      where: {
        id,
      },
    });

    if (!findUser) {
      return null;
    }

    const user = PrismaUserMapper.toDomain(findUser);

    if (findUser.department)
      user.department = Department.create(findUser.department);
    if (findUser.workSchedule)
      user.workSchedule = WorkSchedule.create(findUser.workSchedule);
    if (findUser.company) user.company = Company.create(findUser.company);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }

  async save(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    });
  }

  async findManyByCompanyId(
    companyId: string,
    page: number,
    pagesize: number
  ): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { workSchedule: true, department: true },
      omit: { profileImage: true },
      where: {
        companyId,
      },
      take: pagesize,
      skip: (page - 1) * pagesize,
    });

    return users.map((raw) => {
      PrismaUserMapper.toDomain;
      const user = PrismaUserMapper.toDomain({ ...raw, profileImage: "" });

      if (raw.department) user.department = Department.create(raw.department);
      if (raw.workSchedule)
        user.workSchedule = WorkSchedule.create(raw.workSchedule);

      return user;
    });
  }

  async countByCompanyId(companyId: string): Promise<number> {
    return await this.prisma.user.count({
      where: {
        companyId,
      },
    });
  }
}
