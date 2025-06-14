import { PaginationParams } from "@/core/repositories/pagination-params";
import { LocationsRepository } from "@/domain/application/repositories/locations-repository";
import { Location } from "@/domain/entities/location";
import { Injectable } from "@nestjs/common";
import { PrismaLocationMapper } from "../mappers/prisma-location-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaLocationsRepository implements LocationsRepository {
  constructor(private prisma: PrismaService) {}

  async findByCompanyId(companyId: string): Promise<Location[]> {
    const locations = await this.prisma.location.findMany({
      where: { companyId },
    });

    return locations.map(PrismaLocationMapper.toDomain);
  }

  async create(location: Location): Promise<void> {
    const data = PrismaLocationMapper.toPrisma(location);
    await this.prisma.location.create({ data });
  }

  async save(location: Location): Promise<void> {
    const data = PrismaLocationMapper.toPrisma(location);

    await this.prisma.location.update({
      where: { id: location.id.toString() },
      data,
    });
  }

  async findById(id: string): Promise<Location | null> {
    const location = await this.prisma.location.findUnique({
      where: { id },
    });

    if (!location) return null;

    return PrismaLocationMapper.toDomain(location);
  }

  async findByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<Location | null> {
    const location = await this.prisma.location.findFirst({
      where: {
        latitude,
        longitude,
      },
    });

    if (!location) return null;

    return PrismaLocationMapper.toDomain(location);
  }

  async findManyByCompanyId(
    companyId: string,
    { page, pagesize }: PaginationParams
  ): Promise<Location[]> {
    const locations = await this.prisma.location.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: pagesize,
      skip: (page - 1) * pagesize,
      where: { companyId },
    });

    return locations.map(PrismaLocationMapper.toDomain);
  }

  async countByCompanyId(companyId: string): Promise<number> {
    const total = await this.prisma.location.count({ where: { companyId } });
    return total;
  }

  async delete(location: Location): Promise<void> {
    await this.prisma.location.delete({
      where: { id: location.id.toString() },
    });
  }
}
