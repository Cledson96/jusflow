import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { OrganizationId } from "../common/organization.decorator";
import { TriageService } from "./triage.service";

@Controller()
export class TriageController {
  constructor(private readonly triage: TriageService) {}

  @UseGuards(AuthGuard)
  @Get("cases/:caseId/triage")
  getForCase(
    @OrganizationId() organizationId: string,
    @CurrentUser() user: any,
    @Param("caseId") caseId: string
  ) {
    return this.triage.getForCase(organizationId, user, caseId);
  }

  @UseGuards(AuthGuard)
  @Post("cases/:caseId/triage")
  saveForCase(
    @OrganizationId() organizationId: string,
    @CurrentUser() user: any,
    @Param("caseId") caseId: string,
    @Body() body: { answers: Record<string, string> }
  ) {
    return this.triage.saveForCase(organizationId, user, caseId, body.answers);
  }

  @Get("public/triage/:token")
  publicForm(@Param("token") token: string) {
    return this.triage.publicForm(token);
  }

  @Post("public/triage/:token")
  publicSave(@Param("token") token: string, @Body() body: { answers: Record<string, string> }) {
    return this.triage.publicSave(token, body.answers);
  }
}
