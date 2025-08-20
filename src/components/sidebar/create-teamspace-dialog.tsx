import { UsersRound } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SidebarMenuButton } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export function CreateTeamspaceDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <UsersRound />
          <span>Create Teamspace</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Teamspace</DialogTitle>
          <DialogDescription>
            Teamspaces are where your team organizes pages, permissions, and
            members
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center gap-2'>
          <div className='grid flex-1 gap-2'>
            <Label htmlFor='link' className='sr-only'>
              Link
            </Label>
            <Input
              id='link'
              defaultValue='https://ui.shadcn.com/docs/installation'
              readOnly
            />
          </div>
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
