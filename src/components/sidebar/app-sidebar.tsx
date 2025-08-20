"use client";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavTeamspace } from "@/components/sidebar/nav-teamspace";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarData } from "@/constants/sidebar";
import { Organization } from "@/lib/auth";
import { CreateWorkspaceLogo } from "./create-workspace-logo";

export function AppSidebar({
  username,
  email,
  organizations,
  activeOrganizationId,
  memberRole,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  username: string;
  email: string;
  organizations: Organization[];
  activeOrganizationId: string;
  memberRole: string;
}) {
  return (
    <Sidebar className='border-r-0' {...props}>
      <SidebarHeader>
        <div className='flex flex-row justify-between w-full items-center gap-4'>
          <TeamSwitcher
            username={username}
            email={email}
            organizations={organizations}
            currentOrganizationId={activeOrganizationId}
          />
          <CreateWorkspaceLogo />
        </div>
        <NavMain
          items={sidebarData.navMain}
          organization_id={activeOrganizationId}
          memberRole={memberRole}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavTeamspace activeOrganizationId={activeOrganizationId} />
        <NavSecondary items={sidebarData.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
