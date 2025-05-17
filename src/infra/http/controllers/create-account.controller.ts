import { CompanyAlreadyExistsError } from "@/domain/application/use-cases/errors/company-already-exists-error";
import { UserAlreadyExistsError } from "@/domain/application/use-cases/errors/user-already-exists-error";
import { RegisterUseCase } from "@/domain/application/use-cases/register";
import { Public } from "@/infra/auth/public";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const createAccountBodySchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  company: z.string().min(1, "Nome da empresa obrigatório"),
  cnpj: z
    .string()
    .regex(/^\d{14}$/, "CNPJ inválido — deve conter 14 dígitos numéricos"),
  email: z.string().email(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
@Public()
export class CreateAccountController {
  constructor(private register: RegisterUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password, company, cnpj } = body;

    const result = await this.register.execute({
      name,
      email,
      password,
      company,
      cnpj,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        case CompanyAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
