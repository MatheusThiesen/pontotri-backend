import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Company } from "./company";
import { Location } from "./location";
import { User } from "./user";
import { WorkSchedule } from "./work-schedule";

export type TimeRecordType = "ENTRY" | "EXIT" | "BREAK_START" | "BREAK_END";

export type TimeRecordFilter = {
  userId?: string;
};

export interface TimeRecordProps {
  type: TimeRecordType;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;

  userId: string;
  user?: User;

  locationId?: string;
  location?: Location;

  workScheduleId?: string;
  workSchedule?: WorkSchedule;

  companyId: string;
  company?: Company;
}

export class TimeRecord extends Entity<TimeRecordProps> {
  get type() {
    return this.props.type;
  }

  set type(value: TimeRecordType) {
    this.props.type = value;
  }

  get photoUrl() {
    return this.props.photoUrl;
  }

  set photoUrl(value: string | undefined) {
    this.props.photoUrl = value;
  }

  get latitude() {
    return this.props.latitude;
  }

  set latitude(value: number | undefined) {
    this.props.latitude = value;
  }

  get longitude() {
    return this.props.longitude;
  }

  set longitude(value: number | undefined) {
    this.props.longitude = value;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get userId() {
    return this.props.userId;
  }

  get user() {
    return this.props.user;
  }

  set user(user: User | undefined) {
    this.props.user = user;
  }

  get locationId() {
    return this.props.locationId;
  }

  set locationId(value: string | undefined) {
    this.props.locationId = value;
  }

  get location() {
    return this.props.location;
  }

  set location(location: Location | undefined) {
    this.props.location = location;
  }

  get workScheduleId() {
    return this.props.workScheduleId;
  }

  set workScheduleId(value: string | undefined) {
    this.props.workScheduleId = value;
  }

  get workSchedule() {
    return this.props.workSchedule;
  }

  set workSchedule(value: WorkSchedule | undefined) {
    this.props.workSchedule = value;
  }

  get companyId() {
    return this.props.companyId;
  }

  set companyId(value: string) {
    this.props.companyId = value;
  }

  get company() {
    return this.props.company;
  }

  set company(value: Company | undefined) {
    this.props.company = value;
  }

  static create(props: TimeRecordProps, id?: string) {
    const timeRecord = new TimeRecord(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id ? new UniqueEntityID(id) : undefined
    );

    return timeRecord;
  }
}
