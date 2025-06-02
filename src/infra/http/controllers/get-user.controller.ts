import { GetUserUseCase } from "@/domain/application/use-cases/user/get-user";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { UserPresenter } from "../presenters/user-presenter";

@Controller("/users")
export class GetUserController {
  constructor(private getUser: GetUserUseCase) {}

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  async handle(@Param("id") id: string) {
    const result = await this.getUser.execute({
      userId: id,
    });

    if (result.isLeft()) {
      throw new NotFoundException();
    }

    return UserPresenter.toHTTP(result.value);
  }
}
