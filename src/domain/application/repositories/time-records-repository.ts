import { PaginationParams } from "@/core/repositories/pagination-params";
import { TimeRecord, TimeRecordFilter } from "@/domain/entities/time-record";

export type TimeRecordFindMany = PaginationParams & {
  filters?: TimeRecordFilter;
};

export abstract class TimeRecordsRepository {
  abstract create(timeRecord: TimeRecord): Promise<void>;
  abstract findById(id: string): Promise<TimeRecord | null>;
  abstract findOpenByUserId(userId: string): Promise<TimeRecord | null>;
  abstract save(timeRecord: TimeRecord): Promise<void>;
  abstract findManyByCompanyId(
    companyId: string,
    params: TimeRecordFindMany
  ): Promise<TimeRecord[]>;
  abstract countByCompanyId(
    companyId: string,
    params?: TimeRecordFilter
  ): Promise<number>;
}
