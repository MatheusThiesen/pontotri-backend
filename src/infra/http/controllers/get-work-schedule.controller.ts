import { GetWorkScheduleUseCase } from "@/domain/application/use-cases/work-schedule/get-work-schedule";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { WorkSchedulePresenter } from "../presenters/work-schedule-presenter";

@Controller("/work-schedules")
export class GetWorkScheduleController {
  constructor(private getWorkSchedule: GetWorkScheduleUseCase) {}

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async handle(@Param("id") id: string) {
    const result = await this.getWorkSchedule.execute({
      workScheduleId: id,
    });

    if (result.isLeft()) {
      throw new NotFoundException();
    }

    return WorkSchedulePresenter.toHTTP(result.value.workSchedule);
  }
}
