import { HydrateClient } from "@/trpc/server";
import { WorkspaceDetailView } from "@/modules/workspace/views/workspace-detail-view";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Home() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <WorkspaceDetailView />
    </HydrateClient>
  );
}
