import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

import { PrismaCompaniesRepository } from "./prisma/repositories/prisma-companies-repository";
import { PrismaDepartmentsRepository } from "./prisma/repositories/prisma-departments-repository";
import { PrismaLocationsRepository } from "./prisma/repositories/prisma-locations-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { PrismaWorkScheduleRepository } from "./prisma/repositories/prisma-work-schedule-repository";

import { CompaniesRepository } from "@/domain/application/repositories/companies-repository";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { LocationsRepository } from "@/domain/application/repositories/locations-repository";
import { TimeRecordsRepository } from "@/domain/application/repositories/time-records-repository";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { WorkScheduleRepository } from "@/domain/application/repositories/work-schedule-repository";
import { PrismaTimeRecordsRepository } from "./prisma/repositories/prisma-time-records-repository";
import { UtilsModule } from "./prisma/utils/utils.module";

@Module({
  imports: [UtilsModule],
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: CompaniesRepository,
      useClass: PrismaCompaniesRepository,
    },
    {
      provide: LocationsRepository,
      useClass: PrismaLocationsRepository,
    },
    {
      provide: DepartmentsRepository,
      useClass: PrismaDepartmentsRepository,
    },
    {
      provide: WorkScheduleRepository,
      useClass: PrismaWorkScheduleRepository,
    },
    {
      provide: TimeRecordsRepository,
      useClass: PrismaTimeRecordsRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    CompaniesRepository,
    LocationsRepository,
    DepartmentsRepository,
    WorkScheduleRepository,
    TimeRecordsRepository,
  ],
})
export class DatabaseModule {}
