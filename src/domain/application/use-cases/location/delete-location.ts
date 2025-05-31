import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { LocationsRepository } from "@/domain/application/repositories/locations-repository";
import { Injectable } from "@nestjs/common";

interface DeleteLocationUseCaseRequest {
  id: string;
}

type DeleteLocationUseCaseResponse = Either<ResourceNotFoundError, null>;

@Injectable()
export class DeleteLocationUseCase {
  constructor(private locationRepository: LocationsRepository) {}

  async execute({
    id,
  }: DeleteLocationUseCaseRequest): Promise<DeleteLocationUseCaseResponse> {
    const location = await this.locationRepository.findById(id);

    if (!location) {
      return left(new ResourceNotFoundError());
    }

    await this.locationRepository.delete(location);

    return right(null);
  }
}
