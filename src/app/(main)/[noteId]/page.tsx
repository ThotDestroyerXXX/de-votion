import { auth } from "@/lib/auth";
import { NoteView } from "@/modules/note/views/note-view";
import { HydrateClient, trpc } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: Readonly<{ params: Promise<{ noteId: string }> }>) {
  const { noteId } = await params;
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data) {
    redirect("/login");
  }

  void trpc.note.getNote.prefetch({ noteId });

  return (
    <HydrateClient>
      <div className='mx-auto max-w-2xl w-full'>
        <NoteView noteId={noteId} />
      </div>
    </HydrateClient>
  );
}
