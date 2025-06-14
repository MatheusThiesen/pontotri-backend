import { AnalyticHomeUseCase } from "@/domain/application/use-cases/reports/analytic-home";
import { ReportTimeMirrorUseCase } from "@/domain/application/use-cases/reports/report-time-mirror";
import { GetUserUseCase } from "@/domain/application/use-cases/user/get-user";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const getReportQuerySchema = z.object({
  userId: z.string().optional(),
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
});

const validKeyEnum = z.enum([
  "time-mirror",
  "overtime",
  "delays",
  "detailed",
  "home-analytic",
]);

type GetReportQuerySchema = z.infer<typeof getReportQuerySchema>;
type KeyReport = z.infer<typeof validKeyEnum>;

@Controller("/reports")
export class GetReportController {
  constructor(
    private analyticHome: AnalyticHomeUseCase,
    private reportTimeMirror: ReportTimeMirrorUseCase,
    private getUser: GetUserUseCase
  ) {}

  @Get(":key")
  @HttpCode(HttpStatus.OK)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("key", new ZodValidationPipe(validKeyEnum)) key: KeyReport,
    @Query(new ZodValidationPipe(getReportQuerySchema))
    query: GetReportQuerySchema
  ) {
    const getUser = await this.getUser.execute({ userId: user.sub });
    if (getUser.isLeft()) {
      throw new NotFoundException();
    }

    switch (key) {
      case "home-analytic":
        const analyticHome = await this.analyticHome.execute({
          userId:
            getUser.value.role === "EMPLOYEE"
              ? getUser.value.id.toString()
              : (query.userId ?? getUser.value.id.toString()),
        });
        return { homeAnalytic: analyticHome.value };
      case "time-mirror":
        const reportTimeMirror = await this.reportTimeMirror.execute({
          userId:
            getUser.value.role === "EMPLOYEE"
              ? getUser.value.id.toString()
              : (query.userId ?? getUser.value.id.toString()),
          dateEnd: new Date(query?.dateEnd as any),
          dateStart: new Date(query?.dateStart as any),
        });
        return { reportTimeMirror: reportTimeMirror.value };

      default:
        break;
    }

    return { key };
  }
}
