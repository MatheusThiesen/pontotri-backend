import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { WorkScheduleDay } from "./work-schedule-day";

export interface WorkScheduleProps {
  name: string;
  companyId: string;
  days?: WorkScheduleDay[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class WorkSchedule extends Entity<WorkScheduleProps> {
  get name(): string {
    return this.props.name;
  }

  get companyId(): string {
    return this.props.companyId;
  }

  get days(): WorkScheduleDay[] {
    return this.props.days ?? [];
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  set days(value: WorkScheduleDay[]) {
    this.props.days = value;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: WorkScheduleProps, id?: UniqueEntityID) {
    return new WorkSchedule(
      {
        ...props,
        days: props.days ?? [],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }
}
