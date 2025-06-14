import { TimeRecord } from "@/domain/entities/time-record";
import {
  Prisma,
  Location as PrismaLocation,
  TimeRecord as PrismaTimeRecord,
  User as PrismaUser,
} from "@prisma/client";
import { PrismaLocationMapper } from "./prisma-location-mapper";
import { PrismaUserMapper } from "./prisma-user-mapper";

export class PrismaTimeRecordMapper {
  static toDomain(
    raw: PrismaTimeRecord & {
      location?: PrismaLocation | null;
      user?: PrismaUser | null;
    }
  ): TimeRecord {
    const timeRecord = TimeRecord.create(
      {
        type: raw.type,
        photoUrl: raw.photoUrl ?? undefined,
        latitude: raw.latitude ?? undefined,
        longitude: raw.longitude ?? undefined,
        userId: raw.userId,
        locationId: raw.locationId ?? undefined,
        workScheduleId: raw.workScheduleId ?? undefined,
        companyId: raw.companyId,
        createdAt: raw.createdAt,
      },
      raw.id
    );

    if (raw.location) {
      timeRecord.location = PrismaLocationMapper.toDomain(raw.location);
    }

    if (raw.user) {
      timeRecord.user = PrismaUserMapper.toDomain(raw.user);
    }

    return timeRecord;
  }

  static toPrisma(
    timeRecord: TimeRecord
  ): Prisma.TimeRecordUncheckedCreateInput {
    return {
      id: timeRecord.id.toString(),
      type: timeRecord.type,
      photoUrl: timeRecord.photoUrl ?? null,
      latitude: timeRecord.latitude ?? null,
      longitude: timeRecord.longitude ?? null,
      createdAt: timeRecord.createdAt,
      userId: timeRecord.userId,
      locationId: timeRecord.locationId ?? null,
      workScheduleId: timeRecord.workScheduleId,
      companyId: timeRecord.companyId,
    };
  }
}
