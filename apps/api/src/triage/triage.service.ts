import { Injectable, NotFoundException } from "@nestjs/common";
import { AuditService } from "../common/audit.service";
import { TenantAccessService } from "../common/tenant-access.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TriageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantAccess: TenantAccessService,
    private readonly audit: AuditService
  ) {}

  async getForCase(organizationId: string, user: any, caseId: string) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    const caseRecord = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId },
      include: {
        caseType: { include: { triageQuestions: { orderBy: { order: "asc" } } } },
        triageAnswers: true
      }
    });
    if (!caseRecord) throw new NotFoundException("Case not found");
    return this.format(caseRecord);
  }

  async saveForCase(
    organizationId: string,
    user: any,
    caseId: string,
    answers: Record<string, string>
  ) {
    this.tenantAccess.assertMembership({ organizationId, memberships: user.memberships });
    const caseRecord = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId },
      include: { caseType: { include: { triageQuestions: true } } }
    });
    if (!caseRecord) throw new NotFoundException("Case not found");
    await this.saveAnswers(caseId, caseRecord.caseType.triageQuestions, answers);
    await this.prisma.case.update({
      where: { id: caseId },
      data: { status: "WAITING_DOCUMENTS" }
    });
    await this.audit.record({
      organizationId,
      userId: user.id,
      action: "triage.saved",
      entityType: "case",
      entityId: caseId
    });
    return this.getForCase(organizationId, user, caseId);
  }

  async publicForm(token: string) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { triageToken: token },
      include: {
        client: true,
        caseType: { include: { triageQuestions: { orderBy: { order: "asc" } } } },
        triageAnswers: true
      }
    });
    if (!caseRecord) throw new NotFoundException("Triage form not found");
    return this.format(caseRecord);
  }

  async publicSave(token: string, answers: Record<string, string>) {
    const caseRecord = await this.prisma.case.findUnique({
      where: { triageToken: token },
      include: { caseType: { include: { triageQuestions: true } } }
    });
    if (!caseRecord) throw new NotFoundException("Triage form not found");
    await this.saveAnswers(caseRecord.id, caseRecord.caseType.triageQuestions, answers);
    return { ok: true };
  }

  private async saveAnswers(caseId: string, questions: { id: string; fieldKey: string }[], answers: Record<string, string>) {
    for (const question of questions) {
      const value = answers[question.fieldKey];
      if (value === undefined) continue;
      await this.prisma.triageAnswer.upsert({
        where: { caseId_questionId: { caseId, questionId: question.id } },
        update: { value },
        create: { caseId, questionId: question.id, value }
      });
    }
  }

  private format(caseRecord: any) {
    const answerMap = Object.fromEntries(
      caseRecord.triageAnswers.map((answer: any) => [answer.questionId, answer.value])
    );
    return {
      caseId: caseRecord.id,
      token: caseRecord.triageToken,
      client: caseRecord.client,
      caseType: caseRecord.caseType.name,
      questions: caseRecord.caseType.triageQuestions.map((question: any) => ({
        id: question.id,
        fieldKey: question.fieldKey,
        label: question.label,
        inputType: question.inputType,
        required: question.required,
        value: answerMap[question.id] ?? ""
      }))
    };
  }
}
