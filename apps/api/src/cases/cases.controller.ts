import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { OrganizationId } from "../common/organization.decorator";
import { CasesService } from "./cases.service";

@UseGuards(AuthGuard)
@Controller("cases")
export class CasesController {
  constructor(private readonly cases: CasesService) {}

  @Get("meta")
  meta(@OrganizationId() organizationId: string, @CurrentUser() user: any) {
    return this.cases.meta(organizationId, user);
  }

  @Get("dashboard")
  dashboard(@OrganizationId() organizationId: string, @CurrentUser() user: any) {
    return this.cases.dashboard(organizationId, user);
  }

  @Get()
  list(@OrganizationId() organizationId: string, @CurrentUser() user: any) {
    return this.cases.list(organizationId, user);
  }

  @Get(":id")
  get(@OrganizationId() organizationId: string, @CurrentUser() user: any, @Param("id") id: string) {
    return this.cases.get(organizationId, user, id);
  }

  @Post()
  create(@OrganizationId() organizationId: string, @CurrentUser() user: any, @Body() body: any) {
    return this.cases.create(organizationId, user, body);
  }

  @Patch(":id/stage")
  move(
    @OrganizationId() organizationId: string,
    @CurrentUser() user: any,
    @Param("id") id: string,
    @Body() body: { status: string }
  ) {
    return this.cases.move(organizationId, user, id, body.status);
  }
}
