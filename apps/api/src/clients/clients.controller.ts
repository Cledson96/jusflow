import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { OrganizationId } from "../common/organization.decorator";
import { ClientsService } from "./clients.service";

@UseGuards(AuthGuard)
@Controller("clients")
export class ClientsController {
  constructor(private readonly clients: ClientsService) {}

  @Get()
  list(@OrganizationId() organizationId: string, @CurrentUser() user: any) {
    return this.clients.list(organizationId, user);
  }

  @Post()
  create(@OrganizationId() organizationId: string, @CurrentUser() user: any, @Body() body: any) {
    return this.clients.create(organizationId, user, body);
  }
}
