import { WorkSchedule } from "@/domain/entities/work-schedule";

const weekOrder = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export class WorkSchedulePresenter {
  static toHTTP(workSchedule: WorkSchedule) {
    return {
      id: workSchedule.id.toValue(),
      name: workSchedule.name,
      companyId: workSchedule.companyId,
      updatedAt: workSchedule.updatedAt,
      days: workSchedule.days
        .sort(
          (a, b) => weekOrder.indexOf(a.weekday) - weekOrder.indexOf(b.weekday)
        )
        .map((day) => ({
          id: day.id.toValue(),
          weekday: day.weekday,
          startTime: day.startTime,
          endTime: day.endTime,
          totalWorkMinutes: day.totalWorkMinutes,
          breakType: day.breakType,
          breakStartWindow: day.breakStartWindow,
          breakEndWindow: day.breakEndWindow,
          breakDuration: day.breakDuration,
        })),
    };
  }
}
