import { Either, right } from "@/core/either";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { Location } from "@/domain/entities/location";
import { Injectable } from "@nestjs/common";
import { LocationsRepository } from "../repositories/locations-repository";

interface FetchLocationsUseCaseRequest extends PaginationParams {
  companyId: string;
}

type FetchLocationsUseCaseResponse = Either<null, { locations: Location[] }>;

@Injectable()
export class FetchLocationsUseCase {
  constructor(private locationsRepository: LocationsRepository) {}

  async execute({
    companyId,
    page,
    pagesize,
  }: FetchLocationsUseCaseRequest): Promise<FetchLocationsUseCaseResponse> {
    const locations = await this.locationsRepository.findManyByCompanyId(
      companyId,
      { page, pagesize }
    );

    return right({ locations });
  }
}
