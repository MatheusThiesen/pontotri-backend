import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";

import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateWorkScheduleController } from "./controllers/create-work-schedule.controller";
import { EditLocationController } from "./controllers/edit-locations.controller";
import { EditWorkScheduleController } from "./controllers/edit-work-schedule.controller";
import { FetchDepartmentsController } from "./controllers/fetch-departments.controller";
import { FetchLocationsController } from "./controllers/fetch-locations.controller";
import { FetchWorkSchedulesController } from "./controllers/fetch-work-schedules.controller";
import { GetLocationController } from "./controllers/get-location.controller";
import { GetWorkScheduleController } from "./controllers/get-work-schedule.controller";
import { MeController } from "./controllers/me.controller";

import { AuthenticateUserUseCase } from "@/domain/application/use-cases/authenticate-user";
import { CreateLocationUseCase } from "@/domain/application/use-cases/create-location";
import { CreateWorkScheduleUseCase } from "@/domain/application/use-cases/create-work-schedule";
import { EditLocationUseCase } from "@/domain/application/use-cases/edit-location";
import { EditWorkScheduleUseCase } from "@/domain/application/use-cases/edit-work-schedule";
import { FetchDepartmentsUseCase } from "@/domain/application/use-cases/fetch-departments";
import { FetchLocationsUseCase } from "@/domain/application/use-cases/fetch-locations";
import { FetchWorkSchedulesUseCase } from "@/domain/application/use-cases/fetch-work-schedules";
import { GetLocationUseCase } from "@/domain/application/use-cases/get-location";
import { GetProfileUseCase } from "@/domain/application/use-cases/get-profile";
import { GetWorkScheduleUseCase } from "@/domain/application/use-cases/get-work-schedule";
import { RegisterUseCase } from "@/domain/application/use-cases/register";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    MeController,

    // Locations
    FetchLocationsController,
    GetLocationController,
    EditLocationController,
    CreateAccountController,

    // Departments
    FetchDepartmentsController,

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
    GetLocationUseCase,
    CreateLocationUseCase,

    // Departments
    FetchDepartmentsUseCase,

    // WorkSchedules,
    CreateWorkScheduleUseCase,
    GetWorkScheduleUseCase,
    FetchWorkSchedulesUseCase,
    EditWorkScheduleUseCase,
  ],
})
export class HttpModule {}
