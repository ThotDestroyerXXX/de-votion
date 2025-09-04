"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Inbox } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar";
import { trpc } from "@/trpc/client";
import { InvitationCard } from "./invitation-card";
import { InvitationStatus } from "better-auth/plugins";

export function InvitationModal() {
  const [data] = trpc.workspace.getPendingInvite.useSuspenseQuery();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Inbox />
            <span>Invitations</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Invitations</DialogTitle>
        <p>you have {data.length} invitations</p>
        {data.map((invite) => (
          <InvitationCard
            invitation={{
              ...invite.invitation,
              role: invite.invitation.role as "member" | "owner" | "admin",
              status: invite.invitation.status as InvitationStatus,
            }}
            organizationName={invite.organizationName}
            userName={invite.userName}
            key={invite.invitation.id}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
}
