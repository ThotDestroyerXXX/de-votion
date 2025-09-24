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
    <div className='items-center mx-auto max-w-2xl w-full'>
      <h1 className='text-2xl font-semibold'>
        Welcome back, {data.user.name}. Select a note to edit
      </h1>
    </div>
  );
}
