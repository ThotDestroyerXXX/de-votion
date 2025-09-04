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
import { NoteDropdown } from "../../note/components/note-dropdown";
import { useNoteHandler } from "@/modules/note/lib/hooks/useNoteHandler";

export function NavTeamspace({
  activeOrganizationId,
}: Readonly<{
  activeOrganizationId: string;
}>) {
  const [data] = trpc.teamspace.getTeamspaces.useSuspenseQuery({
    organization_id: activeOrganizationId,
  });

  const { handleClick } = useNoteHandler();

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
                  <SidebarMenuSub className='w-full'>
                    {teamspace.notes.map((note) => (
                      <SidebarMenuSubItem
                        key={note.id}
                        className='flex flex-row justify-between gap-2'
                      >
                        <SidebarMenuSubButton asChild>
                          <Link href='#'>
                            <span className='line-clamp-1'>{note.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                        {(teamspace.member.role === "admin" ||
                          teamspace.member.role === "owner" ||
                          teamspace.teamspace.permission === "public") && (
                          <SidebarMenuAction asChild>
                            <NoteDropdown noteId={note.id} />
                          </SidebarMenuAction>
                        )}
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
                {(teamspace.member.role === "admin" ||
                  teamspace.member.role === "owner" ||
                  teamspace.teamspace.permission === "public") && (
                  <SidebarMenuAction
                    showOnHover
                    onClick={() => handleClick(teamspace.teamspace.id)}
                  >
                    <Plus />
                  </SidebarMenuAction>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
