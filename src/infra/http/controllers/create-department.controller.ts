import { CreateDepartmentUseCase } from "@/domain/application/use-cases/department/create-department";
import { Public } from "@/infra/auth/public";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { DepartmentPresenter } from "../presenters/department-presenter";

const createDepartmentBodySchema = z.object({
  name: z.string(),
  companyId: z.string().uuid(),
});

type CreateDepartmentBodySchema = z.infer<typeof createDepartmentBodySchema>;

@Controller("/departments")
@Public()
export class CreateDepartmentController {
  constructor(private createDepartment: CreateDepartmentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDepartmentBodySchema))
  async handle(@Body() body: CreateDepartmentBodySchema) {
    const { name, companyId } = body;

    const result = await this.createDepartment.execute({
      name,
      companyId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const department = result.value.department;

    return DepartmentPresenter.toHTTP(department);
  }
}
