import { FetchLocationsUseCase } from "@/domain/application/use-cases/location/fetch-locations";
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

const fetchLocationsQuerySchema = z.object({
  companyId: z.string().uuid(),
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
    @Query(new ZodValidationPipe(fetchLocationsQuerySchema))
    query: FetchLocationsQuery
  ) {
    const { companyId, page, pagesize } = query;

    const result = await this.fetchLocationsUseCase.execute({
      companyId,
      page,
      pagesize,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return {
      locations: result.value,
    };
  }
}
