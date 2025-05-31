import { CreateLocationUseCase } from "@/domain/application/use-cases/location/create-location";
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
import { LocationPresenter } from "../presenters/location-presenter";

const createLocationBodySchema = z.object({
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  companyId: z.string().uuid(),
});

type CreateLocationBody = z.infer<typeof createLocationBodySchema>;

@Controller("/locations")
export class CreateLocationController {
  constructor(private createLocationUseCase: CreateLocationUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Body(new ZodValidationPipe(createLocationBodySchema))
    body: CreateLocationBody
  ) {
    const { description, latitude, longitude, companyId } = body;

    const result = await this.createLocationUseCase.execute({
      description,
      latitude,
      longitude,
      companyId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return LocationPresenter.toHTTP(result.value.location);
  }
}
