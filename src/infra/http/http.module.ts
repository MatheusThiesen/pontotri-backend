import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";

import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { EditLocationController } from "./controllers/edit-locations.controller";
import { FetchLocationsController } from "./controllers/fetch-locations.controller";
import { GetLocationController } from "./controllers/get-location.controller";
import { MeController } from "./controllers/me.controller";

import { AuthenticateUserUseCase } from "@/domain/application/use-cases/authenticate-user";
import { CreateLocationUseCase } from "@/domain/application/use-cases/create-location";
import { EditLocationUseCase } from "@/domain/application/use-cases/edit-location";
import { FetchDepartmentsUseCase } from "@/domain/application/use-cases/fetch-departments";
import { FetchLocationsUseCase } from "@/domain/application/use-cases/fetch-locations";
import { GetLocationUseCase } from "@/domain/application/use-cases/get-location";
import { GetProfileUseCase } from "@/domain/application/use-cases/get-profile";
import { RegisterUseCase } from "@/domain/application/use-cases/register";
import { FetchDepartmentsController } from "./controllers/fetch-departments.controller";

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
    // GetDepartmentController,
    // EditDepartmentController,
    // CreateDepartmentController,
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
    // GetDepartmentUseCase,
    // EditDepartmentUseCase,
    // CreateDepartmentUseCase,
  ],
})
export class HttpModule {}
