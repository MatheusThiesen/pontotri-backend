import { Company } from "@/domain/entities/company";

export class CompanyPresenter {
  static toHTTP(company: Company) {
    return {
      id: company.id.toString(),
      name: company.name,
      cnpj: company.cnpj,
    };
  }
}
