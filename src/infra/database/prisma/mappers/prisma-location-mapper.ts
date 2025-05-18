import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Location } from "@/domain/entities/location";
import { Prisma, Location as PrismaLocation } from "@prisma/client";

export class PrismaLocationMapper {
  static toDomain(raw: PrismaLocation): Location {
    return Location.create(
      {
        description: raw.description,
        latitude: raw.latitude,
        longitude: raw.longitude,
        createdAt: raw.createdAt,
        companyId: raw.companyId,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(location: Location): Prisma.LocationUncheckedCreateInput {
    return {
      id: location.id.toString(),
      description: location.description,
      latitude: location.latitude,
      longitude: location.longitude,
      createdAt: location.createdAt,
      companyId: location.companyId,
    };
  }
}
