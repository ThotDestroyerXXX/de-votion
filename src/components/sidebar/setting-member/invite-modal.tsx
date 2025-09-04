"use client";
import { ErrorAlert } from "@/components/error-alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export function InviteModal({
  pending,
  setPending,
  workspaceId,
}: Readonly<{
  pending: boolean;
  setPending: (pending: boolean) => void;
  workspaceId: string;
}>) {
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();

  const FORM_SCHEMA = z.object({
    email: z.email("Invalid email"),
  });

  const form = useForm<z.infer<typeof FORM_SCHEMA>>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      email: "",
    },
  });

  const { errors } = form.formState;

  const onSubmit = async (data: z.infer<typeof FORM_SCHEMA>) => {
    console.log(data);
    setPending(true);
    setError(undefined);
    try {
      const { error } = await authClient.organization.inviteMember({
        email: data.email, // required
        role: "member", // required
        organizationId: workspaceId, // required
      });
      if (error) {
        setError(error.message);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setError("Failed to update user");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Member</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Invite New Member</DialogTitle>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <div className='flex items-center gap-2'>
              <div className='grid flex-1 gap-2'>
                <Label htmlFor='email'>Insert Email</Label>
                <Input
                  id='email'
                  {...form.register("email")}
                  placeholder='Enter email address'
                  disabled={pending}
                />
                <ErrorMessage
                  errors={errors}
                  name='email'
                  as={<span className='text-red-500 span-small' />}
                />
                {error && <ErrorAlert message={error} />}
              </div>
            </div>
            <DialogFooter className='sm:justify-end'>
              <Button type='submit' variant='default' disabled={pending}>
                Invite
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
