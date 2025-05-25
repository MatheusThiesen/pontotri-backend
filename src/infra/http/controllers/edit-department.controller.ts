import { EditDepartmentUseCase } from "@/domain/application/use-cases/department/edit-department";
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
} from "@nestjs/common";
import { z } from "zod";

const editDepartmentBodySchema = z.object({
  name: z.string(),
  description: z.string(),
});

type EditDepartmentBodySchema = z.infer<typeof editDepartmentBodySchema>;

@Controller("/departments")
export class EditDepartmentController {
  constructor(private editDepartment: EditDepartmentUseCase) {}

  @Put(":id")
  async handle(
    @Param("id") id: string,
    @Body() body: EditDepartmentBodySchema
  ) {
    try {
      const { name } = body;

      const result = await this.editDepartment.execute({
        id,
        departmentId: id,
        name,
      });

      if (result.isLeft()) {
        throw new BadRequestException();
      }

      return result;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
