import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { OrganizationId } from "../common/organization.decorator";
import { LeadsService } from "./leads.service";

@UseGuards(AuthGuard)
@Controller("leads")
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Get()
  list(@OrganizationId() organizationId: string, @CurrentUser() user: any) {
    return this.leads.list(organizationId, user);
  }

  @Post()
  create(@OrganizationId() organizationId: string, @CurrentUser() user: any, @Body() body: any) {
    return this.leads.create(organizationId, user, body);
  }
}
