import { Either, right } from "@/core/either";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { Location } from "@/domain/entities/location";
import { Injectable } from "@nestjs/common";
import { LocationsRepository } from "../../repositories/locations-repository";

interface FetchLocationsUseCaseRequest extends PaginationParams {
  userId: string;
  page: number;
  pagesize: number;
}

type FetchLocationsUseCaseResponse = Either<
  null,
  {
    locations: Location[];
    pagination: {
      page: number;
      pagesize: number;
      total: number;
    };
  }
>;

@Injectable()
export class FetchLocationsUseCase {
  constructor(private locationsRepository: LocationsRepository) {}

  async execute({
    userId,
    page,
    pagesize,
  }: FetchLocationsUseCaseRequest): Promise<FetchLocationsUseCaseResponse> {
    const [locations, total] = await Promise.all([
      this.locationsRepository.findMany({
        page,
        pagesize,
      }),
      this.locationsRepository.count(),
    ]);

    return right({
      locations,
      pagination: {
        total,
        page,
        pagesize,
      },
    });
  }
}
