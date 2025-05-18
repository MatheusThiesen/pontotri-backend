import { CreateDepartmentUseCase } from "@/domain/application/use-cases/create-department";
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

const createDepartmentBodySchema = z.object({
  name: z.string(),
  companyId: z.string().uuid(),
});

type CreateDepartmentBodySchema = z.infer<typeof createDepartmentBodySchema>;

@Controller("/departments")
@Public()
export class CreateDepartmentController {
  constructor(private createDepartmentUseCase: CreateDepartmentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDepartmentBodySchema))
  async handle(@Body() body: CreateDepartmentBodySchema) {
    const result = await this.createDepartmentUseCase.execute(body);

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
