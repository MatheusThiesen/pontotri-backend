import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface LocationProps {
  description: string;
  latitude: number;
  longitude: number;
  companyId: string;
  createdAt?: Date;
}

export class Location extends Entity<LocationProps> {
  private constructor(props: LocationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get description(): string {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
  }

  get latitude(): number {
    return this.props.latitude;
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude;
  }

  get longitude(): number {
    return this.props.longitude;
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude;
  }

  get companyId(): string {
    return this.props.companyId;
  }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  static create(props: LocationProps, id?: UniqueEntityID): Location {
    return new Location(props, id);
  }
}
