"use client";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavTeamspace } from "@/modules/teamspace/components/nav-teamspace";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarData } from "@/constants/sidebar";
import { CreateWorkspaceLogo } from "../../modules/workspace/components/create-workspace-logo";
import { Organization } from "@/lib/auth";

export function AppSidebar({
  username,
  email,
  activeOrganizationId,
  organizations,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  username: string;
  email: string;
  activeOrganizationId: string;
  organizations: Organization[];
}) {
  return (
    <Sidebar className='border-r-0' {...props}>
      <SidebarHeader>
        <div className='flex flex-row justify-between w-full items-center gap-4'>
          <TeamSwitcher
            username={username}
            email={email}
            currentOrganizationId={activeOrganizationId}
            organizations={organizations}
          />
          <CreateWorkspaceLogo />
        </div>
        <NavMain
          organization_id={activeOrganizationId}
          email={email}
          organizations={organizations}
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
