import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

import { PrismaCompaniesRepository } from "./prisma/repositories/prisma-companies-repository";
import { PrismaDepartmentsRepository } from "./prisma/repositories/prisma-departments-repository";
import { PrismaLocationsRepository } from "./prisma/repositories/prisma-locations-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";

import { CompaniesRepository } from "@/domain/application/repositories/companies-repository";
import { DepartmentsRepository } from "@/domain/application/repositories/departments-repository";
import { LocationsRepository } from "@/domain/application/repositories/locations-repository";
import { UsersRepository } from "@/domain/application/repositories/users-repository";

@Module({
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
  ],
  exports: [
    PrismaService,
    UsersRepository,
    CompaniesRepository,
    LocationsRepository,
    DepartmentsRepository,
  ],
})
export class DatabaseModule {}
