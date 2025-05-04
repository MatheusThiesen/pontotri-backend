import { envSchema } from "@/infra/env/env";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { EnvModule } from "./env/env.module";
import { HttpModule } from "./http/http.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => {
        const parsed = envSchema.safeParse(env);
        if (!parsed.success) {
          console.error(parsed.error.format());
          throw new Error("❌ Invalid environment variables");
        }
        return parsed.data;
      },
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
