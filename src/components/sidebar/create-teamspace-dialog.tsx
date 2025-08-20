"use client";
import { UsersRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SidebarMenuButton } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import {
  TEAMSPACE_SCHEMA,
  TeamspaceValues,
} from "@/modules/teamspace/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { teamspacePermission } from "@/db/schema";
import { ErrorMessage } from "@hookform/error-message";
import { useFormSubmit } from "@/modules/teamspace/lib/hooks/useFormSubmit";
import { useState } from "react";
import { ErrorAlert } from "../error-alert";

export function CreateTeamspaceDialog({
  organization_id,
}: Readonly<{
  organization_id: string;
}>) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<TeamspaceValues>({
    resolver: zodResolver(TEAMSPACE_SCHEMA),
    defaultValues: {
      name: "",
      permission: "default",
      organization_id: organization_id,
    },
  });

  const { errors, defaultValues } = form.formState;
  const { handleSubmit } = useFormSubmit(setError, setOpen);

  const onSubmit = async (data: TeamspaceValues) => {
    console.log(data);
    setPending(true);
    await handleSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={pending}>
        <SidebarMenuButton disabled={pending}>
          <UsersRound />
          <span>Create Teamspace</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className='!max-w-md w-full'>
        <DialogHeader>
          <DialogTitle>Create Teamspace</DialogTitle>
          <DialogDescription>
            Teamspaces are where your team organizes pages, permissions, and
            members
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
            <div className='flex items-center gap-4 flex-col'>
              <div className='grid flex-1 gap-2 w-full'>
                <Label htmlFor='name'>Name</Label>
                <Input {...form.register("name")} disabled={pending} />
                <ErrorMessage
                  errors={errors}
                  name='name'
                  as={<span className='text-red-500 span-small' />}
                />
              </div>
              <div className='grid flex-1 gap-2 w-full'>
                <Label htmlFor='permission'>Permission</Label>
                <Select
                  {...form.register("permission")}
                  defaultValue={defaultValues?.permission}
                  disabled={pending}
                >
                  <SelectTrigger className='w-full' disabled={pending}>
                    <SelectValue placeholder='Permission' />
                  </SelectTrigger>
                  <SelectContent>
                    {teamspacePermission.enumValues.map((item) => (
                      <SelectItem key={item} value={item} disabled={pending}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage
                  errors={errors}
                  name='permission'
                  as={<span className='text-red-500 span-small' />}
                />
                <ErrorMessage
                  errors={errors}
                  name='organization_id'
                  as={<span className='text-red-500 span-small' />}
                />
              </div>
              {error && <ErrorAlert message={error} />}
              <Button type='submit' className='w-full' disabled={pending}>
                Create Teamspace
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
