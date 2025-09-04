"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembersTab } from "./members-tab";
import { PendingTab } from "./pending-tab";
import { InviteModal } from "./invite-modal";
import { trpc } from "@/trpc/client";

export function People({
  pending,
  setPending,
  workspaceId,
  email,
}: Readonly<{
  pending: boolean;
  setPending: (pending: boolean) => void;
  workspaceId: string;
  email: string;
}>) {
  const [members] = trpc.workspace.getMembers.useSuspenseQuery();
  return (
    <div>
      <Tabs defaultValue='member'>
        <div className='flex justify-between items-center mb-4'>
          <TabsList>
            <TabsTrigger value='member' disabled={pending}>
              Members
            </TabsTrigger>
            {(members.memberRole === "admin" ||
              members.memberRole === "owner") && (
              <TabsTrigger value='pending' disabled={pending}>
                Pending
              </TabsTrigger>
            )}
          </TabsList>
          {(members.memberRole === "admin" ||
            members.memberRole === "owner") && (
            <InviteModal
              pending={pending}
              setPending={setPending}
              workspaceId={workspaceId}
            />
          )}
        </div>

        <MembersTab
          memberList={members.memberList.map((member) => ({
            ...member,
            role: member.role as "member" | "admin" | "owner",
            user: {
              ...member.user,
              image: member.user.image === null ? undefined : member.user.image,
            },
          }))}
          memberRole={members.memberRole}
          pending={pending}
          setPending={setPending}
          email={email}
        />
        {(members.memberRole === "admin" || members.memberRole === "owner") && (
          <PendingTab pendingMemberList={members.pendingMember} />
        )}
      </Tabs>
    </div>
  );
}
