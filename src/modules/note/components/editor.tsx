"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useDebouncedCallback } from "use-debounce";
import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { noteDetailType } from "@/db/schema";

// Our <Editor> component we can reuse later
export default function Editor({
  noteId,
  noteTitle,
  initialContent,
  editable,
}: Readonly<{
  noteId: string;
  noteTitle: string;
  initialContent?: string;
  editable: boolean;
}>) {
  // Creates a new editor instance.

  const { mutateAsync } = trpc.note.saveNoteContent.useMutation({
    onSuccess: async () => {
      console.log("Note content saved successfully");
    },
    onError: (error) => {
      console.error("Failed to save note content:", error);
    },
  });

  const debouncedSave = useDebouncedCallback(
    // function
    (title: string, value: Block[]) => {
      mutateAsync({
        noteId: noteId,
        title,
        content: JSON.stringify(value),
      });
    },
    // delay in ms
    500
  );

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
  });

  // Renders the editor instance using a React component.
  return (
    <>
      <Textarea
        className='w-full border-none text-[3em]! font-extrabold focus:ring-0 focus-visible:ring-0 field-sizing-content resize-none'
        readOnly={!editable}
        defaultValue={noteTitle}
        placeholder={noteTitle}
        onChange={(e) => {
          debouncedSave(e.target.value, editor.document);
        }}
      />
      <BlockNoteView
        editable={editable}
        editor={editor}
        theme={"light"}
        onChange={() => {
          debouncedSave(noteTitle, editor.document);
        }}
      />
    </>
  );
}
