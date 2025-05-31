import { DeleteLocationUseCase } from "@/domain/application/use-cases/location/delete-location";
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from "@nestjs/common";

@Controller("/locations")
export class DeleteLocationController {
  constructor(private deleteLocation: DeleteLocationUseCase) {}

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param("id") id: string) {
    try {
      const result = await this.deleteLocation.execute({
        id,
      });

      if (result.isLeft()) {
        throw new BadRequestException();
      }
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
