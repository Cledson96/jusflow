import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../common/current-user.decorator";
import { OrganizationId } from "../common/organization.decorator";
import { DocumentsService } from "./documents.service";

@UseGuards(AuthGuard)
@Controller("cases/:caseId/documents")
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get()
  list(
    @OrganizationId() organizationId: string,
    @CurrentUser() user: any,
    @Param("caseId") caseId: string
  ) {
    return this.documents.list(organizationId, user, caseId);
  }

  @Patch(":documentId")
  update(
    @OrganizationId() organizationId: string,
    @CurrentUser() user: any,
    @Param("caseId") caseId: string,
    @Param("documentId") documentId: string,
    @Body() body: any
  ) {
    return this.documents.update(organizationId, user, caseId, documentId, body);
  }
}
