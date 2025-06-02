import { FetchUsersUseCase } from "@/domain/application/use-cases/user/fetch-users";
import { GetUserUseCase } from "@/domain/application/use-cases/user/get-user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { UserPresenter } from "../presenters/user-presenter";

const fetchLocationsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pagesize: z.coerce.number().min(1).max(100).default(10),
});

type FetchLocationsQuery = z.infer<typeof fetchLocationsQuerySchema>;

@Controller("/users")
export class FetchUsersController {
  constructor(
    private fetchUsersUseCase: FetchUsersUseCase,
    private getProfile: GetUserUseCase
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ZodValidationPipe(fetchLocationsQuerySchema))
    query: FetchLocationsQuery
  ) {
    const getProfile = await this.getProfile.execute({ userId: user.sub });

    if (getProfile.isLeft() || !getProfile.value.companyId) {
      throw new BadRequestException();
    }

    const { page, pagesize } = query;

    const result = await this.fetchUsersUseCase.execute({
      companyId: getProfile.value.companyId,
      page,
      pagesize,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const users = result.value.users;
    const pagination = result.value.pagination;

    return {
      ...pagination,
      data: users.map(UserPresenter.toHTTP),
    };
  }
}
