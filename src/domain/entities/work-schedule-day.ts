import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export type Weekday =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";
export type BreakType = "NONE" | "FIXED" | "FLEXIBLE";

export interface WorkScheduleDayProps {
  weekday: Weekday;
  startTime: string;
  endTime: string;
  totalWorkMinutes: number;
  breakType: BreakType;
  breakStartWindow?: string;
  breakEndWindow?: string;
  breakDuration?: number;
  workScheduleId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class WorkScheduleDay extends Entity<WorkScheduleDayProps> {
  get weekday(): Weekday {
    return this.props.weekday;
  }

  get startTime(): string {
    return this.props.startTime;
  }

  get endTime(): string {
    return this.props.endTime;
  }

  get totalWorkMinutes(): number {
    return this.props.totalWorkMinutes;
  }

  get breakType(): BreakType {
    return this.props.breakType;
  }

  get breakStartWindow(): string | undefined {
    return this.props.breakStartWindow;
  }

  get breakEndWindow(): string | undefined {
    return this.props.breakEndWindow;
  }

  get breakDuration(): number | undefined {
    return this.props.breakDuration;
  }

  get workScheduleId(): string {
    return this.props.workScheduleId;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  set startTime(value: string) {
    this.props.startTime = value;
    this.touch();
  }

  set endTime(value: string) {
    this.props.endTime = value;
    this.touch();
  }

  set totalWorkMinutes(value: number) {
    this.props.totalWorkMinutes = value;
    this.touch();
  }

  set breakType(value: BreakType) {
    this.props.breakType = value;
    this.touch();
  }

  set breakStartWindow(value: string | undefined) {
    this.props.breakStartWindow = value;
    this.touch();
  }

  set breakEndWindow(value: string | undefined) {
    this.props.breakEndWindow = value;
    this.touch();
  }

  set breakDuration(value: number | undefined) {
    this.props.breakDuration = value;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: WorkScheduleDayProps, id?: UniqueEntityID) {
    return new WorkScheduleDay(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }
}
