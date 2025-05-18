// domain/entities/department.ts

import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface DepartmentProps {
  name: string;
  companyId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Department extends Entity<DepartmentProps> {
  get name() {
    return this.props.name;
  }

  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  get companyId() {
    return this.props.companyId;
  }

  get createdAt() {
    return this.props.createdAt!;
  }

  get updatedAt() {
    return this.props.updatedAt!;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: DepartmentProps, id?: UniqueEntityID) {
    return new Department(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }
}
