import { EditDepartmentUseCase } from "@/domain/application/use-cases/edit-departments";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const editDepartmentBodySchema = z.object({
  name: z.string(),
});

type EditDepartmentBodySchema = z.infer<typeof editDepartmentBodySchema>;

@Controller("/departments")
export class EditDepartmentController {
  constructor(private editDepartmentUseCase: EditDepartmentUseCase) {}

  @Patch(":id")
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(editDepartmentBodySchema))
  async handle(
    @Param("id") id: string,
    @Body() body: EditDepartmentBodySchema
  ) {
    const { name } = body;

    const result = await this.editDepartmentUseCase.execute({
      departmentId: id,
      name,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
