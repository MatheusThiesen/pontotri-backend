import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Company } from "@/domain/entities/company";
import { Prisma, Company as PrismaCompany } from "@prisma/client";

export class PrismaCompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return Company.create(
      {
        name: raw.name,
        cnpj: raw.cnpj,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(company: Company): Prisma.CompanyUncheckedCreateInput {
    return {
      id: company.id.toString(),
      name: company.name,
      cnpj: company.cnpj,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
