import { Global, Module } from "@nestjs/common";
import { AuditService } from "./audit.service";
import { TenantAccessService } from "./tenant-access.service";

@Global()
@Module({
  providers: [AuditService, TenantAccessService],
  exports: [AuditService, TenantAccessService]
})
export class CommonModule {}
