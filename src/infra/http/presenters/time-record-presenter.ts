import { TimeRecord } from "@/domain/entities/time-record";
import { LocationPresenter } from "./location-presenter";
import { UserPresenter } from "./user-presenter";
import { WorkSchedulePresenter } from "./work-schedule-presenter";

export class TimeRecordPresenter {
  static toHTTP(timeRecord: TimeRecord) {
    return {
      id: timeRecord.id.toString(),
      type: timeRecord.type,
      latitude: timeRecord.latitude,
      longitude: timeRecord.longitude,
      createdAt: timeRecord.createdAt,
      userId: timeRecord.userId,
      user: timeRecord.user ? UserPresenter.toHTTP(timeRecord.user) : undefined,
      locationId: timeRecord.locationId,
      location: timeRecord.location
        ? LocationPresenter.toHTTP(timeRecord.location)
        : undefined,
      workScheduleId: timeRecord.workScheduleId,
      workSchedule: timeRecord.workSchedule
        ? WorkSchedulePresenter.toHTTP(timeRecord.workSchedule)
        : undefined,
      companyId: timeRecord.companyId,
    };
  }
}
