import { User } from "@/domain/entities/user";
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
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      department: user.department
        ? DepartmentPresenter.toHTTP(user.department)
        : undefined,
      workSchedule: user.workSchedule
        ? WorkSchedulePresenter.toHTTP(user.workSchedule)
        : undefined,
    };
  }
}
