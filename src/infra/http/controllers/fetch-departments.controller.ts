import { FetchDepartmentsUseCase } from "@/domain/application/use-cases/fetch-departments";
import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const fetchLocationsQuerySchema = z.object({
  companyId: z.string().uuid(),
  page: z.coerce.number().min(1).default(1),
  pagesize: z.coerce.number().min(1).max(100).default(10),
});

type FetchLocationsQuery = z.infer<typeof fetchLocationsQuerySchema>;

@Controller("/departments")
export class FetchDepartmentsController {
  constructor(private fetchDepartmentsUseCase: FetchDepartmentsUseCase) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(fetchLocationsQuerySchema))
    query: FetchLocationsQuery
  ) {
    const { companyId, page, pagesize } = query;
    const result = await this.fetchDepartmentsUseCase.execute({
      companyId,
      page,
      pagesize,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return result.value.departments;
  }
}
