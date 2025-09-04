"use client";

import { SidebarMenu } from "@/components/ui/sidebar";
import { CreateTeamspaceDialog } from "../../modules/teamspace/components/create-teamspace-dialog";
import { SearchModal } from "./search-modal";
import { SettingMemberModal } from "./setting-member/setting-member-modal";
import { InvitationModal } from "./invitation-modal";
import { trpc } from "@/trpc/client";
import { Organization } from "@/lib/auth";

export function NavMain({
  organization_id,
  email,
  organizations,
}: Readonly<{
  organization_id: string;
  email: string;
  organizations: Organization[];
}>) {
  const [{ memberRole }] = trpc.workspace.getMembers.useSuspenseQuery();
  return (
    <SidebarMenu>
      <SearchModal organization_id={organization_id} />
      <SettingMemberModal
        email={email}
        workspaceId={organization_id}
        organizations={organizations}
      />
      <InvitationModal />

      {(memberRole === "admin" || memberRole === "owner") && (
        <CreateTeamspaceDialog organization_id={organization_id} />
      )}
    </SidebarMenu>
  );
}
