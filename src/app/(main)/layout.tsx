import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { HydrateClient, trpc } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/login");
  }

  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const membersResponse = await auth.api.listMembers({
    headers: await headers(),
    query: {
      organizationId: data.session.activeOrganizationId ?? organizations[0].id,
      sortBy: "createdAt",
      sortDirection: "desc",
      filterField: "userId",
      filterOperator: "eq",
      filterValue: data.user.id,
    },
  });
  const memberRole = membersResponse.members[0].role;

  void trpc.teamspace.getTeamspaces.prefetch({
    organization_id: data.session.activeOrganizationId ?? organizations[0].id,
  });

  return (
    <HydrateClient>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar
          username={data.user.name}
          email={data.user.email}
          organizations={organizations}
          activeOrganizationId={
            data.session.activeOrganizationId ?? organizations[0].id
          }
          memberRole={memberRole}
        />
        <main className='flex flex-col w-full h-full'>
          <header className='flex h-14 shrink-0 items-center gap-2'>
            <div className='flex flex-1 items-center gap-2 px-3'>
              <SidebarTrigger />
            </div>
          </header>
          {children}
        </main>
      </SidebarProvider>
    </HydrateClient>
  );
}
