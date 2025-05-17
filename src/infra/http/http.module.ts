import { AuthenticateUserUseCase } from "@/domain/application/use-cases/authenticate-user";
import { RegisterUseCase } from "@/domain/application/use-cases/register";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AuthenticateController, CreateAccountController],
  providers: [AuthenticateUserUseCase, RegisterUseCase],
})
export class HttpModule {}
