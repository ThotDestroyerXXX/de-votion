"use client";
import { ErrorAlert } from "@/components/error-alert";
import { Button } from "@/components/ui/button";
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

export function MyAccount({
  pending,
  setPending,
  email,
}: Readonly<{
  pending: boolean;
  setPending: (pending: boolean) => void;
  email: string;
}>) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const FORM_SCHEMA = z.object({
    name: z.string().min(1, "Name is required"),
  });

  const form = useForm<z.infer<typeof FORM_SCHEMA>>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      name: "",
    },
  });

  const { errors } = form.formState;

  const onSubmit = async (data: z.infer<typeof FORM_SCHEMA>) => {
    console.log(data);
    setPending(true);
    setError(null);
    try {
      await authClient.updateUser({
        name: data.name,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      setError("Failed to update user");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <Label>Preferred Name</Label>
            <div className='flex flex-row gap-2'>
              <Input
                {...form.register("name")}
                className='max-w-3xs'
                disabled={pending}
              />
              <Button type='submit' disabled={pending}>
                Save
              </Button>
            </div>
            <ErrorMessage
              errors={errors}
              name='name'
              as={<span className='text-red-500 span-small' />}
            />
            {error && <ErrorAlert message={error} />}
          </div>
        </form>
      </Form>
      <header className='flex shrink-0 items-center '>
        <h1 className='text-base'>Account Security</h1>
      </header>
      <Separator />
      <div className='flex flex-row gap-4 justify-between'>
        <div>
          <h2 className='text-sm font-medium'>Email</h2>
          <p className='text-sm text-muted-foreground'>{email}</p>
        </div>
        <div>
          <Button className='h-full' variant={"outline"}>
            Change Email
          </Button>
        </div>
      </div>
      <div className='flex flex-row gap-4 justify-between'>
        <div>
          <h2 className='text-sm font-medium'>Password</h2>
          <p className='text-sm text-muted-foreground'>********</p>
        </div>
        <div>
          <Button className='h-full' variant={"outline"}>
            Change Password
          </Button>
        </div>
      </div>
      <header className='flex shrink-0 items-center '>
        <h1 className='text-base'>Danger Zone</h1>
      </header>
      <Separator />
      <div className='flex flex-row gap-4 justify-between'>
        <Button variant={"destructive"}>Delete Account</Button>
      </div>
    </>
  );
}
