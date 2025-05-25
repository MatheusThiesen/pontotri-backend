import { WorkScheduleRepository } from "@/domain/application/repositories/work-schedule-repository";
import { GetWorkScheduleUseCase } from "@/domain/application/use-cases/work-schedule/get-work-schedule";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from "@nestjs/common";

@Controller("/work-schedules")
export class GetWorkScheduleController {
  constructor(
    private getWorkSchedule: GetWorkScheduleUseCase,
    private workScheduleRepository: WorkScheduleRepository
  ) {}

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async handle(@Param("id") id: string) {
    const result = await this.getWorkSchedule.execute({
      workScheduleId: id,
    });

    if (result.isLeft()) {
      throw new NotFoundException();
    }

    return {
      workSchedule: result.value.workSchedule,
    };
  }
}
