import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { OrganizationId } from "../common/organization.decorator";
import { AiService } from "./ai.service";

@UseGuards(AuthGuard)
@Controller("cases/:caseId/ai")
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post("triage-summary")
  generate(
    @OrganizationId() organizationId: string,
    @CurrentUser() user: any,
    @Param("caseId") caseId: string
  ) {
    return this.ai.generateForCase(organizationId, user, caseId);
  }
}
