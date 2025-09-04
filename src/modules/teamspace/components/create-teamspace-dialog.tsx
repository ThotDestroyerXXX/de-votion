"use client";
import { UsersRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../components/ui/sidebar";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { useForm } from "react-hook-form";
import {
  TEAMSPACE_SCHEMA,
  TeamspaceValues,
} from "@/modules/teamspace/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { teamspacePermission } from "@/db/schema";
import { ErrorMessage } from "@hookform/error-message";
import { useFormSubmit } from "@/modules/teamspace/lib/hooks/useFormSubmit";
import { useState } from "react";
import { ErrorAlert } from "@/components/error-alert";

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

  const { errors } = form.formState;
  const { handleSubmit } = useFormSubmit(setError, setOpen);

  const onSubmit = async (data: TeamspaceValues) => {
    console.log("Submitting data:", data);
    setPending(true);
    try {
      await handleSubmit(data);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={pending}>
        <SidebarMenuItem>
          <SidebarMenuButton disabled={pending}>
            <UsersRound />
            <span>Create Teamspace</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <FormField
                  control={form.control}
                  name='permission'
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor='permission'>Permission</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={pending}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select permission' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teamspacePermission.enumValues.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
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
