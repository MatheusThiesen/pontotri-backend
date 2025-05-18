import { GetLocationUseCase } from "@/domain/application/use-cases/get-location";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from "@nestjs/common";

@Controller("/locations")
export class GetLocationController {
  constructor(private getLocationUseCase: GetLocationUseCase) {}

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async handle(@Param("id") id: string) {
    const result = await this.getLocationUseCase.execute({ locationId: id });

    if (result.isLeft()) {
      throw new NotFoundException("Localização não encontrada.");
    }

    return {
      location: result.value.location,
    };
  }
}
