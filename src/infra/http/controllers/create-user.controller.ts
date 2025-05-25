import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error";
import { CreateUserUseCase } from "@/domain/application/use-cases/user/create-user";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { Role } from "@prisma/client";
import { z } from "zod";

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role).optional(),
  companyId: z.string().optional(),
  departmentId: z.string().optional(),
  workScheduleId: z.string().optional(),
  profileImage: z.string().optional(),
});

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

@Controller("/users")
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  async handle(@Body() body: CreateUserBodySchema) {
    const {
      name,
      email,
      password,
      role,
      companyId,
      departmentId,
      workScheduleId,
      profileImage,
    } = createUserBodySchema.parse(body);

    const result = await this.createUser.execute({
      name,
      email,
      password,
      role,
      companyId,
      departmentId,
      workScheduleId,
      profileImage,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { user } = result.value;

    return {
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        companyId: user.companyId,
        departmentId: user.departmentId,
        workScheduleId: user.workScheduleId,
        profileImage: user.profileImage,
      },
    };
  }
}
