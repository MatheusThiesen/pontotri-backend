import { EditWorkScheduleUseCase } from "@/domain/application/use-cases/work-schedule/edit-work-schedule";
import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const editWorkScheduleBodySchema = z.object({
  name: z.string(),
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

type EditWorkScheduleBodySchema = z.infer<typeof editWorkScheduleBodySchema>;

@Controller("/work-schedules")
export class EditWorkScheduleController {
  constructor(private editWorkSchedule: EditWorkScheduleUseCase) {}

  @Put(":id")
  async handle(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(editWorkScheduleBodySchema))
    body: EditWorkScheduleBodySchema
  ) {
    const { name, days } = body;

    const result = await this.editWorkSchedule.execute({
      id,
      name,
      days,
    });

    if (result.isLeft()) {
      throw new NotFoundException();
    }

    return {
      workSchedule: result.value.workSchedule,
    };
  }
}
