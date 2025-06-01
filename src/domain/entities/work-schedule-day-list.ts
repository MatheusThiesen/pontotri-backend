import { WatchedList } from "@/core/entities/watched-list";
import { WorkScheduleDay } from "./work-schedule-day";

export class WorkScheduleDayList extends WatchedList<WorkScheduleDay> {
  compareItems(a: WorkScheduleDay, b: WorkScheduleDay): boolean {
    return a.weekday === b.weekday;
  }
}
