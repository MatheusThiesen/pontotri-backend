import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface CompanyProps {
  name: string;
  cnpj: string;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Company extends Entity<CompanyProps> {
  get name() {
    return this.props.name;
  }

  get cnpj() {
    return this.props.cnpj;
  }

  get latitude() {
    return this.props.latitude;
  }

  get longitude() {
    return this.props.longitude;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: CompanyProps, id?: UniqueEntityID) {
    const now = new Date();

    const entity = new Company(
      {
        ...props,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id
    );

    return entity;
  }
}
