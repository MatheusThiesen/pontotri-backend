import { DeleteDepartmentUseCase } from "@/domain/application/use-cases/department/delete-department";
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from "@nestjs/common";

@Controller("/departments")
export class DeleteDepartmentController {
  constructor(private deleteDepartment: DeleteDepartmentUseCase) {}

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param("id") id: string) {
    try {
      const result = await this.deleteDepartment.execute({
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
