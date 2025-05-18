import { Department } from "@/domain/entities/department";

export interface DepartmentsRepository {
  create(department: Department): Promise<void>;
  save(department: Department): Promise<void>;
  findById(id: string): Promise<Department | null>;
  findManyByCompanyId(
    companyId: string,
    page: number,
    pageSize: number
  ): Promise<Department[]>;
}
