import { auth } from "@/lib/auth";
import { WorkspaceTypeView } from "@/modules/workspace/views/workspace-type-view";
import { HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/login");
  }

  return (
    <HydrateClient>
      <WorkspaceTypeView />
    </HydrateClient>
  );
}
