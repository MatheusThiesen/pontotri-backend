import { PaginationParams } from "@/core/repositories/pagination-params";
import { Department } from "@/domain/entities/department";

export abstract class DepartmentsRepository {
  abstract create(department: Department): Promise<void>;
  abstract save(department: Department): Promise<void>;
  abstract delete(department: Department): Promise<void>;
  abstract findById(id: string): Promise<Department | null>;
  abstract findMany(params: PaginationParams): Promise<Department[]>;
  abstract count(): Promise<number>;
}
