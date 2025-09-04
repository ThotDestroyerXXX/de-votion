import { trpc } from "@/trpc/client";

export const useNoteHandler = () => {
  const utils = trpc.useUtils();
  const { mutateAsync } = trpc.note.createNote.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
    onError: (error) => {
      console.error("Failed to create note:", error);
    },
  });

  const { mutateAsync: deleteNoteAsync } = trpc.note.deleteNote.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
    onError: (error) => {
      console.error("Failed to delete note:", error);
    },
  });

  const { mutateAsync: duplicateNoteAsync } =
    trpc.note.duplicateNote.useMutation({
      onSuccess: async () => {
        await utils.invalidate();
      },
      onError: (error) => {
        console.error("Failed to duplicate note:", error);
      },
    });

  const handleClick = async (teamspaceId: string) => {
    await mutateAsync({ teamspaceId });
  };

  const handleDelete = async (noteId: string) => {
    await deleteNoteAsync({ noteId });
  };

  const handleDuplicate = async (noteId: string) => {
    await duplicateNoteAsync({ noteId });
  };

  return {
    handleClick,
    handleDelete,
    handleDuplicate,
  };
};
