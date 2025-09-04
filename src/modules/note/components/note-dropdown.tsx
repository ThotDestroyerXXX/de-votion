import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNoteHandler } from "../lib/hooks/useNoteHandler";

export function NoteDropdown({ noteId }: Readonly<{ noteId: string }>) {
  const { handleDelete, handleDuplicate } = useNoteHandler();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='link' size='icon' className='size-6 px-4'>
          <EllipsisVertical className='size-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuItem onClick={() => handleDuplicate(noteId)}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(noteId)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
