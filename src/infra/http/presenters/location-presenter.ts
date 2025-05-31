import { Location } from "@/domain/entities/location";

export class LocationPresenter {
  static toHTTP(location: Location) {
    return {
      id: location.id.toString(),
      description: location.description,
      latitude: location.latitude,
      longitude: location.longitude,
      companyId: location.companyId,
    };
  }
}
