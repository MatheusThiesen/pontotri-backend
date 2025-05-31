import { Department } from "@/domain/entities/department";

export class DepartmentPresenter {
  static toHTTP(department: Department) {
    return {
      id: department.id.toString(),
      name: department.name,
      companyId: department.companyId,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    };
  }
}
