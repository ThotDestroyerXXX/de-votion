"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CreateTeamspaceDialog } from "./create-teamspace-dialog";
import { SearchModal } from "./search-modal";

export function NavMain({
  items,
  organization_id,
  memberRole,
}: Readonly<{
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    dialog?: React.ElementType;
  }[];
  organization_id: string;
  memberRole: string;
}>) {
  return (
    <SidebarMenu>
      <SearchModal organization_id={organization_id} />
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.isActive}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      {(memberRole === "admin" || memberRole === "owner") && (
        <CreateTeamspaceDialog organization_id={organization_id} />
      )}
    </SidebarMenu>
  );
}
