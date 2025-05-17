import { CompaniesRepository } from "@/domain/application/repositories/companies-repository";
import { Company } from "@/domain/entities/company";
import { Injectable } from "@nestjs/common";
import { PrismaCompanyMapper } from "../mappers/prisma-company-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaCompaniesRepository implements CompaniesRepository {
  constructor(private prisma: PrismaService) {}

  async create(company: Company): Promise<void> {
    const data = PrismaCompanyMapper.toPrisma(company);

    await this.prisma.company.create({ data });
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: {
        cnpj,
      },
    });

    if (!company) {
      return null;
    }

    return PrismaCompanyMapper.toDomain(company);
  }
}
