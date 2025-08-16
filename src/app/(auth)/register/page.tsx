import { RegisterView } from "@/modules/auth/views/register-view";
import { HydrateClient } from "@/trpc/server";

export default function Page() {
  return (
    <HydrateClient>
      <RegisterView />
    </HydrateClient>
  );
}
