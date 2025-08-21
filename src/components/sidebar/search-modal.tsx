"use client";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SidebarMenuButton } from "../ui/sidebar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { trpc } from "@/trpc/client";

export function SearchModal({
  organization_id,
}: Readonly<{ organization_id: string }>) {
  const [data] = trpc.teamspace.getTeamspaces.useSuspenseQuery({
    organization_id,
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <Search />
          <span>Search</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className='!max-w-md w-full p-2' showCloseButton={false}>
        <DialogTitle hidden />
        <Command>
          <CommandInput placeholder='Type a command or search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {data.map((teamspace) => (
              <CommandGroup
                heading={teamspace.teamspace.name}
                key={teamspace.teamspace.id}
              >
                {teamspace.notes.map((note) => (
                  <CommandItem key={note.id}>{note.title}</CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
