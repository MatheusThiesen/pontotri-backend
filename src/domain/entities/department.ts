import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface DepartmentProps {
  name: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Department extends Entity<DepartmentProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get companyId() {
    return this.props.companyId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Omit<DepartmentProps, "createdAt" | "updatedAt">,
    id?: string
  ) {
    const department = new Department(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id ? new UniqueEntityID(id) : undefined
    );

    return department;
  }
}
