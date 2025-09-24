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

  console.log(data?.session.activeOrganizationId);

  if (!data || !data.user) {
    redirect("/login");
  }

  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  // Only prefetch if we have a valid organization ID
  if (!data.session.activeOrganizationId && !organizations) {
    redirect("/workspace");
  } else if (
    !data.session.activeOrganizationId &&
    organizations &&
    organizations.length > 0
  ) {
    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: {
        organizationId: organizations[0].id,
      },
    });
  }
  void trpc.workspace.getMembers.prefetch();
  void trpc.workspace.getPendingInvite.prefetch();
  void trpc.teamspace.getTeamspaces.prefetch({
    organization_id: data.session.activeOrganizationId ?? organizations[0].id,
  });

  return (
    <HydrateClient>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar
          username={data.user.name}
          email={data.user.email}
          activeOrganizationId={
            data.session.activeOrganizationId ?? organizations[0].id
          }
          organizations={organizations}
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
