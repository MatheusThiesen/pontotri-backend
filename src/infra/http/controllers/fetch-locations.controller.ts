import { FetchLocationsUseCase } from "@/domain/application/use-cases/location/fetch-locations";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { LocationPresenter } from "../presenters/location-presenter";

const fetchLocationsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pagesize: z.coerce.number().min(1).max(100).default(10),
});

type FetchLocationsQuery = z.infer<typeof fetchLocationsQuerySchema>;

@Controller("/locations")
export class FetchLocationsController {
  constructor(private fetchLocationsUseCase: FetchLocationsUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ZodValidationPipe(fetchLocationsQuerySchema))
    query: FetchLocationsQuery
  ) {
    const { page, pagesize } = query;

    const result = await this.fetchLocationsUseCase.execute({
      page,
      pagesize,
      userId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const locations = result.value.locations;
    const pagination = result.value.pagination;

    return {
      ...pagination,
      data: locations.map(LocationPresenter.toHTTP),
    };
  }
}
