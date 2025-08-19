import { auth } from "@/lib/auth";
import { HydrateClient } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/login");
  }

  if (!data.session.activeOrganizationId) {
    redirect("/workspace");
  }
  return (
    <HydrateClient>
      <div>aa</div>
    </HydrateClient>
  );
}
