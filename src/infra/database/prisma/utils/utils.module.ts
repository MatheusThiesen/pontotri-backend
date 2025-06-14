import { Global, Module } from "@nestjs/common";
import { OrderByPrisma } from "./order-by-prisma.utils";
import { SearchFilterPrisma } from "./search-filter-prisma.utils";
import { WhereFilterPrisma } from "./where-filter-prisma.utils";

@Global()
@Module({
  providers: [SearchFilterPrisma, OrderByPrisma, WhereFilterPrisma],
  exports: [SearchFilterPrisma, OrderByPrisma, WhereFilterPrisma],
})
export class UtilsModule {}
