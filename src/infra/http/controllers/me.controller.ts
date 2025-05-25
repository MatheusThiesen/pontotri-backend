import { WrongCredentialsError } from "@/domain/application/use-cases/errors/wrong-credentials-error";
import { GetProfileUseCase } from "@/domain/application/use-cases/user/get-profile";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  UnauthorizedException,
} from "@nestjs/common";

@Controller("/auth/me")
export class MeController {
  constructor(private getProfile: GetProfileUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.getProfile.execute({
      userId: user.sub,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return result.value;
  }
}
