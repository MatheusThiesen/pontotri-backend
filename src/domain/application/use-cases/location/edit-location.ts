import { Either, left, right } from "@/core/either";
import { Location } from "@/domain/entities/location";
import { Injectable } from "@nestjs/common";
import { LocationsRepository } from "../../repositories/locations-repository";

interface SaveLocationUseCaseRequest {
  id: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

type SaveLocationUseCaseResponse = Either<Error, { location: Location }>;

@Injectable()
export class EditLocationUseCase {
  constructor(private locationsRepository: LocationsRepository) {}

  async execute({
    id,
    description,
    latitude,
    longitude,
  }: SaveLocationUseCaseRequest): Promise<SaveLocationUseCaseResponse> {
    const location = await this.locationsRepository.findById(id);

    if (!location) {
      return left(new Error("Location not found."));
    }

    if (description) location.description = description;
    if (latitude !== undefined) location.latitude = latitude;
    if (longitude !== undefined) location.longitude = longitude;

    await this.locationsRepository.save(location);

    return right({ location });
  }
}
