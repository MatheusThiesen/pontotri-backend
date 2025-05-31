import { FetchDepartmentsUseCase } from "@/domain/application/use-cases/department/fetch-departments";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { DepartmentPresenter } from "../presenters/department-presenter";

const fetchLocationsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pagesize: z.coerce.number().min(1).max(100).default(10),
});

type FetchLocationsQuery = z.infer<typeof fetchLocationsQuerySchema>;

@Controller("/departments")
export class FetchDepartmentsController {
  constructor(private fetchDepartmentsUseCase: FetchDepartmentsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ZodValidationPipe(fetchLocationsQuerySchema))
    query: FetchLocationsQuery
  ) {
    const { page, pagesize } = query;

    const result = await this.fetchDepartmentsUseCase.execute({
      userId: user.sub,
      page,
      pagesize,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const departments = result.value.departments;
    const pagination = result.value.pagination;

    return {
      ...pagination,
      data: departments.map(DepartmentPresenter.toHTTP),
    };
  }
}
