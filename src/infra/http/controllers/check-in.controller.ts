import { InvalidCheckInError } from "@/core/errors/invalid-check-in-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { CheckInUseCase } from "@/domain/application/use-cases/time-record/check-in";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { TimeRecordPresenter } from "../presenters/time-record-presenter";

const checkInBodySchema = z.object({
  checkInImage: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

type CheckInBodySchema = z.infer<typeof checkInBodySchema>;

@Controller("/time-records")
export class CheckInController {
  constructor(private checkIn: CheckInUseCase) {}

  @Post("check-in")
  @HttpCode(201)
  @UsePipes()
  async handle(
    @Body(new ZodValidationPipe(checkInBodySchema)) body: CheckInBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { checkInImage, latitude, longitude } = checkInBodySchema.parse(body);

    const result = await this.checkIn.execute({
      userId: user.sub,
      checkInImage,
      latitude,
      longitude,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case InvalidCheckInError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { timeRecord } = result.value;

    return TimeRecordPresenter.toHTTP(timeRecord);
  }
}
