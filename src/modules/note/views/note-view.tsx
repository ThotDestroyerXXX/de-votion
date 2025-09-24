"use client";

import { trpc } from "@/trpc/client";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export const NoteView = ({ noteId }: { noteId: string }) => {
  const Editor = useMemo(
    () => dynamic(() => import("../components/editor"), { ssr: false }),
    []
  );

  const [data] = trpc.note.getNote.useSuspenseQuery({ noteId });

  return (
    <Editor
      noteId={noteId}
      initialContent={data.note.content}
      editable={data.editable}
      noteTitle={data.note.title}
    />
  );
};
