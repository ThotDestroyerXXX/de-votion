import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
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

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar
        username={data.user.name}
        email={data.user.email}
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
  );
}
