import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/login");
  }

  return (
    <div className='items-center mx-auto max-w-2xl bg-red-500 py-16 px-4 w-full'>
      aa
    </div>
  );
}
