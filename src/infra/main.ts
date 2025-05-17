import { NestFactory } from "@nestjs/core";
import morgan from "morgan";
import { AppModule } from "./app.module";
import { EnvService } from "./env/env.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "*",
    },
  });

  const configService = app.get(EnvService);
  const port = configService.get("PORT");
  app.use(morgan("dev"));
  await app.listen(port);
}

bootstrap();
