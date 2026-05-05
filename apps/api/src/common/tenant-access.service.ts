import { ForbiddenException, Injectable } from "@nestjs/common";
import type { MemberRole } from "@jurisflow/shared";

export interface Membership {
  organizationId: string;
  role: MemberRole;
}

@Injectable()
export class TenantAccessService {
  assertMembership(input: { organizationId: string; memberships: Membership[] }) {
    const membership = input.memberships.find(
      (item) => item.organizationId === input.organizationId
    );

    if (!membership) {
      throw new ForbiddenException("User does not belong to this organization");
    }

    return membership;
  }
}
