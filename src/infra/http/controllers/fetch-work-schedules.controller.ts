import { GetUserUseCase } from "@/domain/application/use-cases/user/get-user";
import { FetchWorkSchedulesUseCase } from "@/domain/application/use-cases/work-schedule/fetch-work-schedules";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { WorkSchedulePresenter } from "../presenters/work-schedule-presenter";

const fetchWorkSchedulesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pagesize: z.coerce.number().min(1).max(100).default(10),
});

type FetchWorkSchedulesQuery = z.infer<typeof fetchWorkSchedulesQuerySchema>;

@Controller("/work-schedules")
export class FetchWorkSchedulesController {
  constructor(
    private fetchWorkSchedulesUseCase: FetchWorkSchedulesUseCase,
    private getProfile: GetUserUseCase
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ZodValidationPipe(fetchWorkSchedulesQuerySchema))
    query: FetchWorkSchedulesQuery
  ) {
    const currentUser = await this.getProfile.execute({
      userId: user.sub,
    });

    if (currentUser.isLeft() || !currentUser.value.companyId) {
      throw new BadRequestException();
    }

    const { page, pagesize } = query;

    const result = await this.fetchWorkSchedulesUseCase.execute({
      companyId: currentUser.value.companyId,
      page,
      pagesize,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const workSchedules = result.value.workSchedules;
    const pagination = result.value.pagination;

    return {
      ...pagination,
      data: workSchedules.map(WorkSchedulePresenter.toHTTP),
    };
  }
}
