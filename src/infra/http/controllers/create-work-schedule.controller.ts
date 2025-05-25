import { CreateWorkScheduleUseCase } from "@/domain/application/use-cases/create-work-schedule";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const createWorkScheduleBodySchema = z.object({
  name: z.string(),
  companyId: z.string(),
  days: z.array(
    z.object({
      weekday: z.enum([
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ] as const),
      startTime: z.string(),
      endTime: z.string(),
      totalWorkMinutes: z.number(),
      breakType: z.enum(["FIXED", "FLEXIBLE", "NONE"] as const),
      breakStartWindow: z.string().optional(),
      breakEndWindow: z.string().optional(),
      breakDuration: z.number().optional(),
    })
  ),
});

type CreateWorkScheduleBodySchema = z.infer<
  typeof createWorkScheduleBodySchema
>;

@Controller("/work-schedules")
export class CreateWorkScheduleController {
  constructor(private createWorkSchedule: CreateWorkScheduleUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Body(new ZodValidationPipe(createWorkScheduleBodySchema))
    body: CreateWorkScheduleBodySchema
  ) {
    const { name, companyId, days } = body;

    try {
      const result = await this.createWorkSchedule.execute({
        name,
        companyId,
        days,
      });

      if (!result.value) {
        throw new Error("Failed to create work schedule");
      }

      return {
        workSchedule: result.value.workSchedule,
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : "Invalid request"
      );
    }
  }
}
