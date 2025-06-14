import { FetchTimeRecordsUseCase } from "@/domain/application/use-cases/time-record/fetch-time-records";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { TimeRecordPresenter } from "../presenters/time-record-presenter";

const fetchLocationsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pagesize: z.coerce.number().min(1).max(100).default(10),
  userId: z.string().optional(),
});

type FetchLocationsQuery = z.infer<typeof fetchLocationsQuerySchema>;

@Controller("/records")
export class FetchTimeRecordsController {
  constructor(private fetchTimeRecordsUseCase: FetchTimeRecordsUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ZodValidationPipe(fetchLocationsQuerySchema))
    query: FetchLocationsQuery
  ) {
    const { page, pagesize } = query;

    const result = await this.fetchTimeRecordsUseCase.execute({
      userId: user.sub,
      page,
      pagesize,
      filters: {
        userId: query.userId,
      },
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const timeRecords = result.value.timeRecords;
    const pagination = result.value.pagination;

    return {
      ...pagination,
      data: timeRecords.map(TimeRecordPresenter.toHTTP),
    };
  }
}
