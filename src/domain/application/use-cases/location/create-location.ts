import { Either, right } from "@/core/either";
import { LocationsRepository } from "@/domain/application/repositories/locations-repository";
import { Location } from "@/domain/entities/location";
import { Injectable } from "@nestjs/common";

interface CreateLocationUseCaseRequest {
  description: string;
  latitude: number;
  longitude: number;
  companyId: string;
}

type CreateLocationUseCaseResponse = Either<null, { location: Location }>;

@Injectable()
export class CreateLocationUseCase {
  constructor(private locationsRepository: LocationsRepository) {}

  async execute({
    description,
    latitude,
    longitude,
    companyId,
  }: CreateLocationUseCaseRequest): Promise<CreateLocationUseCaseResponse> {
    const location = Location.create({
      description,
      latitude,
      longitude,
      companyId,
    });

    await this.locationsRepository.create(location);

    return right({ location });
  }
}
