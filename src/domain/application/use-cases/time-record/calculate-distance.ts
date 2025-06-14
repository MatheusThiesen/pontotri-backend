import { Either, right } from "@/core/either";
import { Injectable } from "@nestjs/common";

interface CalculateDistanceUseCaseRequest {
  location1: Location;
  location2: Location;
}

interface Location {
  latitude: number;
  longitude: number;
}

type CalculateDistanceUseCaseResponse = Either<
  never,
  {
    distance: number;
  }
>;

@Injectable()
export class CalculateDistanceUseCase {
  async execute({
    location1,
    location2,
  }: CalculateDistanceUseCaseRequest): Promise<CalculateDistanceUseCaseResponse> {
    const distance = this.calculateDistance(location1, location2);

    return right({
      distance,
    });
  }

  private calculateDistance(location1: Location, location2: Location): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(location2.latitude - location1.latitude);
    const dLon = this.toRad(location2.longitude - location1.longitude);
    const lat1 = this.toRad(location1.latitude);
    const lat2 = this.toRad(location2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  private toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
