import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export type UserRole = "ADMIN" | "OWNER" | "MANAGER" | "EMPLOYEE";

export interface UserProps {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  companyId?: string;
  departmentId?: string;
  workScheduleId?: string;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get role(): UserRole {
    return this.props.role ?? "EMPLOYEE";
  }

  get isActive(): boolean {
    return this.props.isActive ?? true;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  get companyId(): string | undefined {
    return this.props.companyId;
  }

  get departmentId(): string | undefined {
    return this.props.departmentId;
  }

  get workScheduleId(): string | undefined {
    return this.props.workScheduleId;
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const now = new Date();

    return new User(
      {
        ...props,
        role: props.role ?? "EMPLOYEE",
        isActive: props.isActive ?? true,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id
    );
  }
}
