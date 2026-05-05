import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { OrganizationsModule } from "./organizations/organizations.module";
import { ClientsModule } from "./clients/clients.module";
import { LeadsModule } from "./leads/leads.module";
import { CasesModule } from "./cases/cases.module";
import { TriageModule } from "./triage/triage.module";
import { DocumentsModule } from "./documents/documents.module";
import { AiModule } from "./ai/ai.module";
import { CommonModule } from "./common/common.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CommonModule,
    AuthModule,
    OrganizationsModule,
    ClientsModule,
    LeadsModule,
    CasesModule,
    TriageModule,
    DocumentsModule,
    AiModule
  ]
})
export class AppModule {}
