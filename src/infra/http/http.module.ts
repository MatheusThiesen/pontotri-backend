import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";

import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateWorkScheduleController } from "./controllers/create-work-schedule.controller";
import { EditLocationController } from "./controllers/edit-locations.controller";
import { EditWorkScheduleController } from "./controllers/edit-work-schedule.controller";
import { FetchLocationsController } from "./controllers/fetch-locations.controller";
import { FetchWorkSchedulesController } from "./controllers/fetch-work-schedules.controller";
import { GetWorkScheduleController } from "./controllers/get-work-schedule.controller";
import { MeController } from "./controllers/me.controller";

import { CreateDepartmentUseCase } from "@/domain/application/use-cases/department/create-department";
import { EditDepartmentUseCase } from "@/domain/application/use-cases/department/edit-department";
import { FetchDepartmentsUseCase } from "@/domain/application/use-cases/department/fetch-departments";
import { CreateLocationUseCase } from "@/domain/application/use-cases/location/create-location";
import { EditLocationUseCase } from "@/domain/application/use-cases/location/edit-location";
import { FetchLocationsUseCase } from "@/domain/application/use-cases/location/fetch-locations";
import { RegisterUseCase } from "@/domain/application/use-cases/register";
import { AuthenticateUserUseCase } from "@/domain/application/use-cases/user/authenticate-user";
import { GetProfileUseCase } from "@/domain/application/use-cases/user/get-profile";
import { CreateWorkScheduleUseCase } from "@/domain/application/use-cases/work-schedule/create-work-schedule";
import { EditWorkScheduleUseCase } from "@/domain/application/use-cases/work-schedule/edit-work-schedule";
import { FetchWorkSchedulesUseCase } from "@/domain/application/use-cases/work-schedule/fetch-work-schedules";
import { GetWorkScheduleUseCase } from "@/domain/application/use-cases/work-schedule/get-work-schedule";
import { CreateDepartmentController } from "./controllers/create-department.controller";
import { EditDepartmentController } from "./controllers/edit-departments.controller";
import { FetchDepartmentsController } from "./controllers/fetch-departments.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    MeController,

    // Locations
    FetchLocationsController,
    EditLocationController,
    CreateAccountController,

    // Departments
    FetchDepartmentsController,
    CreateDepartmentController,
    EditDepartmentController,

    // WorkSchedules
    CreateWorkScheduleController,
    GetWorkScheduleController,
    FetchWorkSchedulesController,
    EditWorkScheduleController,
  ],
  providers: [
    AuthenticateUserUseCase,
    RegisterUseCase,
    GetProfileUseCase,

    // Locations
    FetchLocationsUseCase,
    EditLocationUseCase,
    CreateLocationUseCase,

    // Departments
    FetchDepartmentsUseCase,
    CreateDepartmentUseCase,
    EditDepartmentUseCase,

    // WorkSchedules
    CreateWorkScheduleUseCase,
    GetWorkScheduleUseCase,
    FetchWorkSchedulesUseCase,
    EditWorkScheduleUseCase,
  ],
})
export class HttpModule {}
