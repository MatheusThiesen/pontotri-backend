import { User } from "@/domain/entities/user";
import { CompanyPresenter } from "./company-presenter";
import { DepartmentPresenter } from "./department-presenter";
import { WorkSchedulePresenter } from "./work-schedule-presenter";

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      companyId: user.companyId,
      departmentId: user.departmentId,
      workScheduleId: user.workScheduleId,
      department: user.department
        ? DepartmentPresenter.toHTTP(user.department)
        : undefined,
      workSchedule: user.workSchedule
        ? WorkSchedulePresenter.toHTTP(user.workSchedule)
        : undefined,
      company: user.company ? CompanyPresenter.toHTTP(user.company) : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profileImage: user.profileImage,
    };
  }
}
