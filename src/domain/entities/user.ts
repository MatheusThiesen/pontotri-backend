import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Role } from "@prisma/client";
import { Department } from "./department";
import { WorkSchedule } from "./work-schedule";

export interface UserProps {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  companyId?: string;
  departmentId?: string;
  workScheduleId?: string;
  department?: Department;
  workSchedule?: WorkSchedule;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get workSchedule() {
    return this.props.workSchedule;
  }

  set workSchedule(workSchedule: WorkSchedule | undefined) {
    this.props.workSchedule = workSchedule;
    this.touch();
  }

  get department() {
    return this.props.department;
  }

  set department(department: Department | undefined) {
    this.props.department = department;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get role() {
    return this.props.role;
  }

  set role(role: Role) {
    this.props.role = role;
    this.touch();
  }

  get isActive() {
    return this.props.isActive;
  }

  set isActive(isActive: boolean) {
    this.props.isActive = isActive;
    this.touch();
  }

  get companyId() {
    return this.props.companyId;
  }

  set companyId(companyId: string | undefined) {
    this.props.companyId = companyId;
    this.touch();
  }

  get departmentId() {
    return this.props.departmentId;
  }

  set departmentId(departmentId: string | undefined) {
    this.props.departmentId = departmentId;
    this.touch();
  }

  get workScheduleId() {
    return this.props.workScheduleId;
  }

  set workScheduleId(workScheduleId: string | undefined) {
    this.props.workScheduleId = workScheduleId;
    this.touch();
  }

  get profileImage() {
    return this.props.profileImage;
  }

  set profileImage(profileImage: string | undefined) {
    this.props.profileImage = profileImage;
    this.touch();
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
    props: Omit<UserProps, "createdAt" | "updatedAt">,
    id?: string
  ) {
    const user = new User(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id ? new UniqueEntityID(id) : undefined
    );

    return user;
  }
}
