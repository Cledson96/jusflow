import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { OrganizationsService } from "./organizations.service";

@UseGuards(AuthGuard)
@Controller()
export class OrganizationsController {
  constructor(private readonly organizations: OrganizationsService) {}

  @Get("me")
  me(@CurrentUser() user: { id: string; email: string }) {
    return this.organizations.me(user.id);
  }

  @Post("organizations")
  createOrganization(
    @CurrentUser() user: { id: string },
    @Body() body: { name: string; slug?: string }
  ) {
    return this.organizations.createOrganization(user.id, body);
  }
}
