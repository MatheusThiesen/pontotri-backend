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
import { FetchLocationsUseCase } from "@/domain/application/use-cases/fetch-locations";
import { GetLocationUseCase } from "@/domain/application/use-cases/get-location";
import { GetProfileUseCase } from "@/domain/application/use-cases/get-profile";
import { RegisterUseCase } from "@/domain/application/use-cases/register";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    MeController,
    FetchLocationsController,
    GetLocationController,
    EditLocationController,
    CreateAccountController,
  ],
  providers: [
    AuthenticateUserUseCase,
    RegisterUseCase,
    GetProfileUseCase,
    FetchLocationsUseCase,
    EditLocationUseCase,
    GetLocationUseCase,
    CreateLocationUseCase,
  ],
})
export class HttpModule {}
