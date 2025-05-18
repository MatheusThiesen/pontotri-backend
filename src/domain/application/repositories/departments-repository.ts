import { Department } from "@/domain/entities/department";

export abstract class DepartmentsRepository {
  abstract create(department: Department): Promise<void>;
  abstract save(department: Department): Promise<void>;
  abstract findById(id: string): Promise<Department | null>;
  abstract findManyByCompanyId(
    companyId: string,
    page: number,
    pageSize: number
  ): Promise<Department[]>;
}
