import { GetDepartmentUseCase } from "@/domain/application/use-cases/get-department";
import { Controller, Get, NotFoundException, Param } from "@nestjs/common";

@Controller("/departments")
export class GetDepartmentController {
  constructor(private getDepartmentUseCase: GetDepartmentUseCase) {}

  @Get(":id")
  async handle(@Param("id") id: string) {
    const result = await this.getDepartmentUseCase.execute({
      departmentId: id,
    });

    if (result.isLeft()) {
      throw new NotFoundException();
    }

    return result.value.department;
  }
}
