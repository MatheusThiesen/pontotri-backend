import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Location } from "@/domain/entities/location";
import { Injectable } from "@nestjs/common";
import { LocationsRepository } from "../repositories/locations-repository";

interface GetLocationUseCaseRequest {
  locationId: string;
}

type GetLocationUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    location: Location;
  }
>;

@Injectable()
export class GetLocationUseCase {
  constructor(private locationsRepository: LocationsRepository) {}

  async execute({
    locationId,
  }: GetLocationUseCaseRequest): Promise<GetLocationUseCaseResponse> {
    const location = await this.locationsRepository.findById(locationId);

    if (!location) {
      return left(new ResourceNotFoundError());
    }

    return right({ location });
  }
}
