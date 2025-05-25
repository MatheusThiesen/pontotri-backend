import { FetchWorkSchedulesUseCase } from "@/domain/application/use-cases/work-schedule/fetch-work-schedules";
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

const fetchWorkSchedulesQuerySchema = z.object({
  companyId: z.string().uuid(),
  page: z.coerce.number().min(1).default(1),
  pagesize: z.coerce.number().min(1).max(100).default(10),
});

type FetchWorkSchedulesQuery = z.infer<typeof fetchWorkSchedulesQuerySchema>;

@Controller("/work-schedules")
export class FetchWorkSchedulesController {
  constructor(private fetchWorkSchedulesUseCase: FetchWorkSchedulesUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async handle(
    @Query(new ZodValidationPipe(fetchWorkSchedulesQuerySchema))
    query: FetchWorkSchedulesQuery
  ) {
    const { companyId, page, pagesize } = query;

    const result = await this.fetchWorkSchedulesUseCase.execute({
      companyId,
      page,
      pagesize,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      workSchedules: result.value.workSchedules,
    };
  }
}
