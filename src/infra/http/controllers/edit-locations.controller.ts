import { EditLocationUseCase } from "@/domain/application/use-cases/location/edit-location";
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { LocationPresenter } from "../presenters/location-presenter";

const editLocationBodySchema = z.object({
  description: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type EditLocationBody = z.infer<typeof editLocationBodySchema>;

@Controller("/locations")
export class EditLocationController {
  constructor(private editLocationUseCase: EditLocationUseCase) {}

  @Put(":id")
  async handle(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(editLocationBodySchema))
    body: EditLocationBody
  ) {
    const { description, latitude, longitude } = body;

    const result = await this.editLocationUseCase.execute({
      id,
      description,
      latitude,
      longitude,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const location = result.value.location;

    return LocationPresenter.toHTTP(location);
  }
}
