"use client";
import { ChevronRight, Plus } from "lucide-react";

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
                <SidebarMenuButton asChild className='ml-4'>
                  <span>{teamspace.teamspace.name}</span>
                </SidebarMenuButton>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction
                    className='bg-sidebar-accent text-sidebar-accent-foreground left-0 data-[state=open]:rotate-90'
                    showOnHover
                  >
                    <ChevronRight />
                  </SidebarMenuAction>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {teamspace.notes.map((note) => (
                      <SidebarMenuSubItem key={note.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href='#'>
                            <span>{note.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
                <SidebarMenuAction showOnHover>
                  <Plus />
                </SidebarMenuAction>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
