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
  private readonly _description: string;
  private readonly _latitude: number;
  private readonly _longitude: number;
  private readonly _companyId: string;
  private readonly _createdAt: Date;

  private constructor(props: LocationProps, id?: UniqueEntityID) {
    super(props, id);

    this._description = props.description;
    this._latitude = props.latitude;
    this._longitude = props.longitude;
    this._companyId = props.companyId;
    this._createdAt = props.createdAt ?? new Date();
  }

  get description(): string {
    return this._description;
  }

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  get companyId(): string {
    return this._companyId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set description(description: string) {
    this.props.description = description;
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude;
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude;
  }

  static create(props: LocationProps, id?: UniqueEntityID): Location {
    return new Location(props, id);
  }
}
