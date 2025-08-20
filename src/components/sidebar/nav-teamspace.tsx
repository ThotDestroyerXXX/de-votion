"use client";
import { ChevronRight, MoreHorizontal, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { trpc } from "@/trpc/client";

export function NavTeamspace({
  activeOrganizationId,
}: Readonly<{
  activeOrganizationId: string;
}>) {
  const [data] = trpc.teamspace.getTeamspaces.useSuspenseQuery({
    organization_id: activeOrganizationId,
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Teamspaces</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {data.map((teamspace) => (
            <Collapsible key={teamspace.teamspace.id}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href='#'>
                    <span>{teamspace.teamspace.name}</span>
                  </Link>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction
                    className='bg-sidebar-accent text-sidebar-accent-foreground left-2 data-[state=open]:rotate-90'
                    showOnHover
                  >
                    <ChevronRight />
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <SidebarMenuAction showOnHover>
                  <Plus />
                </SidebarMenuAction>
                {/* <CollapsibleContent>
                  <SidebarMenuSub>
                    {workspace.pages.map((page) => (
                      <SidebarMenuSubItem key={page.name}>
                        <SidebarMenuSubButton asChild>
                          <Link href='#'>
                            <span>{page.emoji}</span>
                            <span>{page.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent> */}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
