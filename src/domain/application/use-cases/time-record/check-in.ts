import { Either, left, right } from "@/core/either";
import { InvalidCheckInError } from "@/core/errors/invalid-check-in-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { TimeRecordsRepository } from "@/domain/application/repositories/time-records-repository";
import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { Location } from "@/domain/entities/location";
import { TimeRecord } from "@/domain/entities/time-record";
import { Injectable } from "@nestjs/common";
import { LocationsRepository } from "../../repositories/locations-repository";
import { WorkScheduleRepository } from "../../repositories/work-schedule-repository";
import { CalculateDistanceUseCase } from "./calculate-distance";
import { CompareImagesUseCase } from "./compare-images";
import { DefineNextTypeTimeRecordUseCase } from "./define-next-type-time-record";

interface CheckInUseCaseRequest {
  userId: string;
  checkInImage: string;
  latitude: number;
  longitude: number;
}

type CheckInUseCaseResponse = Either<
  ResourceNotFoundError | InvalidCheckInError,
  {
    timeRecord: TimeRecord;
  }
>;

@Injectable()
export class CheckInUseCase {
  private readonly KM_RADIUS = 1; // 1km

  constructor(
    private usersRepository: UsersRepository,
    private workScheduleRepository: WorkScheduleRepository,
    private locationsRepository: LocationsRepository,
    private timeRecordsRepository: TimeRecordsRepository,
    private compareImagesUseCase: CompareImagesUseCase,
    private calculateDistance: CalculateDistanceUseCase,
    private defineNextTypeTimeRecord: DefineNextTypeTimeRecordUseCase
  ) {}

  async execute({
    userId,
    checkInImage,
    latitude,
    longitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user?.companyId) {
      return left(new ResourceNotFoundError());
    }

    if (!user.profileImage) {
      return left(
        new InvalidCheckInError("Usuário não possui imagem de perfil")
      );
    }

    const currentCheckIn = await this.timeRecordsRepository.findOpenByUserId(
      user.id.toString()
    );

    const imageValidation = await this.compareImagesUseCase.execute({
      profileImage: user.profileImage,
      checkInImage,
    });

    if (imageValidation.isLeft()) {
      const message = imageValidation.value.message;
      return left(
        new InvalidCheckInError(
          `Erro ao validar imagem do check-in: ${message}`
        )
      );
    }

    if (!imageValidation.value.isMatch) {
      return left(
        new InvalidCheckInError(
          "Imagem do check-in não corresponde à imagem do perfil"
        )
      );
    }

    const locations = await this.locationsRepository.findByCompanyId(
      user.companyId
    );

    const nearestLocation = await this.findNearestLocation(
      { latitude, longitude },
      locations
    );

    if (nearestLocation.distance > this.KM_RADIUS) {
      return left(
        new InvalidCheckInError(
          `Usuário está fora do raio permitido. Distância: ${nearestLocation.distance.toFixed(
            2
          )}km, Raio permitido: ${this.KM_RADIUS}km`
        )
      );
    }

    const workSchedule = user.workScheduleId
      ? await this.workScheduleRepository.findById(user.workScheduleId)
      : undefined;

    const nextTypeResult = await this.defineNextTypeTimeRecord.execute({
      workSchedule: workSchedule ?? undefined,
      currentType: currentCheckIn?.type,
    });

    if (nextTypeResult.isLeft()) {
      return left(
        new InvalidCheckInError(
          "Você já registrou todos os pontos diários permitidos."
        )
      );
    }

    const timeRecord = TimeRecord.create({
      userId: user.id.toString(),
      companyId: user.companyId,
      workScheduleId: user.workScheduleId,
      locationId: nearestLocation.location.id.toString(),
      type: nextTypeResult.value,
      latitude,
      longitude,
      photoUrl: checkInImage,
      createdAt: new Date(),
    });

    await this.timeRecordsRepository.create(timeRecord);

    return right({ timeRecord });
  }

  private async findNearestLocation(
    userLocation: { latitude: number; longitude: number },
    companyLocations: Location[]
  ): Promise<{ location: Location; distance: number }> {
    let nearestLocation: Location | null = null;
    let shortestDistance = Infinity;

    for (const location of companyLocations) {
      const result = await this.calculateDistance.execute({
        location1: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        location2: userLocation,
      });

      if (result.isRight() && result.value.distance < shortestDistance) {
        shortestDistance = result.value.distance;
        nearestLocation = location;
      }
    }

    if (!nearestLocation) {
      throw new Error("Nenhuma localização encontrada");
    }

    return {
      location: nearestLocation,
      distance: shortestDistance,
    };
  }
}
