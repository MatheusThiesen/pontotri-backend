import { PaginationParams } from "@/core/repositories/pagination-params";
import { Location } from "@/domain/entities/location";

export abstract class LocationsRepository {
  abstract create(location: Location): Promise<void>;
  abstract save(location: Location): Promise<void>;
  abstract delete(location: Location): Promise<void>;
  abstract findMany(params: PaginationParams): Promise<Location[]>;
  abstract count(): Promise<number>;
  abstract findById(id: string): Promise<Location | null>;
  abstract findByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<Location | null>;
}
