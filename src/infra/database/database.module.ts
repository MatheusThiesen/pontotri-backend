import { CompaniesRepository } from "@/domain/application/repositories/companies-repository";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaCompaniesRepository } from "./prisma/repositories/prisma-companies-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";

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
  ],
  exports: [PrismaService, UsersRepository, CompaniesRepository],
})
export class DatabaseModule {}
