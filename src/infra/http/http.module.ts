import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";

import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CheckInController } from "./controllers/check-in.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateWorkScheduleController } from "./controllers/create-work-schedule.controller";
import { EditLocationController } from "./controllers/edit-locations.controller";
import { EditWorkScheduleController } from "./controllers/edit-work-schedule.controller";
import { FetchLocationsController } from "./controllers/fetch-locations.controller";
import { FetchWorkSchedulesController } from "./controllers/fetch-work-schedules.controller";
import { GetWorkScheduleController } from "./controllers/get-work-schedule.controller";
import { MeController } from "./controllers/me.controller";

import { CreateDepartmentUseCase } from "@/domain/application/use-cases/department/create-department";
import { DeleteDepartmentUseCase } from "@/domain/application/use-cases/department/delete-department";
import { EditDepartmentUseCase } from "@/domain/application/use-cases/department/edit-department";
import { FetchDepartmentsUseCase } from "@/domain/application/use-cases/department/fetch-departments";
import { CreateLocationUseCase } from "@/domain/application/use-cases/location/create-location";
import { DeleteLocationUseCase } from "@/domain/application/use-cases/location/delete-location";
import { EditLocationUseCase } from "@/domain/application/use-cases/location/edit-location";
import { FetchLocationsUseCase } from "@/domain/application/use-cases/location/fetch-locations";
import { RegisterUseCase } from "@/domain/application/use-cases/register";
import { AnalyticHomeUseCase } from "@/domain/application/use-cases/reports/analytic-home";
import { ReportTimeMirrorUseCase } from "@/domain/application/use-cases/reports/report-time-mirror";
import { CalculateDistanceUseCase } from "@/domain/application/use-cases/time-record/calculate-distance";
import { CheckInUseCase } from "@/domain/application/use-cases/time-record/check-in";
import { CompareImagesUseCase } from "@/domain/application/use-cases/time-record/compare-images";
import { DefineNextTypeTimeRecordUseCase } from "@/domain/application/use-cases/time-record/define-next-type-time-record";
import { FetchTimeRecordsUseCase } from "@/domain/application/use-cases/time-record/fetch-time-records";
import { AuthenticateUserUseCase } from "@/domain/application/use-cases/user/authenticate-user";
import { CreateUserUseCase } from "@/domain/application/use-cases/user/create-user";
import { EditUserUseCase } from "@/domain/application/use-cases/user/edit-user";
import { FetchUsersUseCase } from "@/domain/application/use-cases/user/fetch-users";
import { GetUserUseCase } from "@/domain/application/use-cases/user/get-user";
import { CreateWorkScheduleUseCase } from "@/domain/application/use-cases/work-schedule/create-work-schedule";
import { EditWorkScheduleUseCase } from "@/domain/application/use-cases/work-schedule/edit-work-schedule";
import { FetchWorkSchedulesUseCase } from "@/domain/application/use-cases/work-schedule/fetch-work-schedules";
import { GetWorkScheduleUseCase } from "@/domain/application/use-cases/work-schedule/get-work-schedule";
import { CreateDepartmentController } from "./controllers/create-department.controller";
import { CreateLocationController } from "./controllers/create-location.controller";
import { CreateUserController } from "./controllers/create-user.controller";
import { DeleteDepartmentController } from "./controllers/delete-department.controller";
import { DeleteLocationController } from "./controllers/delete-location.controller";
import { EditDepartmentController } from "./controllers/edit-department.controller";
import { EditUserController } from "./controllers/edit-user.controller";
import { FetchDepartmentsController } from "./controllers/fetch-departments.controller";
import { FetchTimeRecordsController } from "./controllers/fetch-time-records.controller";
import { FetchUsersController } from "./controllers/fetch-users.controller";
import { GetReportController } from "./controllers/get-report.controller";
import { GetUserController } from "./controllers/get-user.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    // Authorization
    MeController,
    AuthenticateController,
    CreateAccountController,

    // Users
    FetchUsersController,
    CreateUserController,
    EditUserController,
    GetUserController,

    // Locations
    FetchLocationsController,
    EditLocationController,
    CreateLocationController,
    DeleteLocationController,

    // Departments
    FetchDepartmentsController,
    CreateDepartmentController,
    EditDepartmentController,
    DeleteDepartmentController,

    // WorkSchedules
    CreateWorkScheduleController,
    GetWorkScheduleController,
    FetchWorkSchedulesController,
    EditWorkScheduleController,

    // TimeRecords
    CheckInController,
    FetchTimeRecordsController,

    // Reports
    GetReportController,
  ],
  providers: [
    // Authorization
    AuthenticateUserUseCase,
    RegisterUseCase,

    // Users
    FetchUsersUseCase,
    CreateUserUseCase,
    EditUserUseCase,
    GetUserUseCase,

    // Locations
    FetchLocationsUseCase,
    EditLocationUseCase,
    CreateLocationUseCase,
    DeleteLocationUseCase,

    // Departments
    FetchDepartmentsUseCase,
    CreateDepartmentUseCase,
    EditDepartmentUseCase,
    DeleteDepartmentUseCase,

    // WorkSchedules
    CreateWorkScheduleUseCase,
    GetWorkScheduleUseCase,
    FetchWorkSchedulesUseCase,
    EditWorkScheduleUseCase,

    // TimeRecords
    CheckInUseCase,
    FetchTimeRecordsUseCase,
    CalculateDistanceUseCase,
    CompareImagesUseCase,
    DefineNextTypeTimeRecordUseCase,

    // Reports
    AnalyticHomeUseCase,
    ReportTimeMirrorUseCase,
  ],
})
export class HttpModule {}
