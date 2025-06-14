import { Either, left, right } from "@/core/either";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { Location } from "@/domain/entities/location";
import { Injectable } from "@nestjs/common";
import { LocationsRepository } from "../../repositories/locations-repository";
import { UsersRepository } from "../../repositories/users-repository";

interface FetchLocationsUseCaseRequest extends PaginationParams {
  userId: string;
  page: number;
  pagesize: number;
}

type FetchLocationsUseCaseResponse = Either<
  null,
  {
    locations: Location[];
    pagination: {
      page: number;
      pagesize: number;
      total: number;
    };
  }
>;

@Injectable()
export class FetchLocationsUseCase {
  constructor(
    private locationsRepository: LocationsRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    userId,
    page,
    pagesize,
  }: FetchLocationsUseCaseRequest): Promise<FetchLocationsUseCaseResponse> {
    const getUser = await this.usersRepository.findById(userId);
    if (!getUser || !getUser.companyId) return left(null);

    const [locations, total] = await Promise.all([
      this.locationsRepository.findManyByCompanyId(getUser.companyId, {
        page,
        pagesize,
      }),
      this.locationsRepository.countByCompanyId(getUser.companyId),
    ]);

    return right({
      locations,
      pagination: {
        total,
        page,
        pagesize,
      },
    });
  }
}
