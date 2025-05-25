import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserAlreadyExistsError } from "@/core/errors/user-already-exists-error";
import { EditUserUseCase } from "@/domain/application/use-cases/user/edit-user";
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
} from "@nestjs/common";
import { Role } from "@prisma/client";
import { z } from "zod";

const editUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(Role).optional(),
  isActive: z.boolean().optional(),
  companyId: z.string().optional(),
  departmentId: z.string().optional(),
  workScheduleId: z.string().optional(),
  profileImage: z.string().optional(),
});

type EditUserBodySchema = z.infer<typeof editUserBodySchema>;

@Controller("/users")
export class EditUserController {
  constructor(private editUser: EditUserUseCase) {}

  @Put(":id")
  async handle(@Param("id") id: string, @Body() body: EditUserBodySchema) {
    const {
      name,
      email,
      password,
      role,
      isActive,
      companyId,
      departmentId,
      workScheduleId,
      profileImage,
    } = editUserBodySchema.parse(body);

    const result = await this.editUser.execute({
      id,
      name,
      email,
      password,
      role,
      isActive,
      companyId,
      departmentId,
      workScheduleId,
      profileImage,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
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
