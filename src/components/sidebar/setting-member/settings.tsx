"use client";
import { ErrorAlert } from "@/components/error-alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Organization } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useFormSubmit } from "@/modules/workspace/lib/hooks/useFormSubmit";
import { trpc } from "@/trpc/client";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export function Settings({
  workspaceId,
  setPending,
  pending,
  organizations,
}: Readonly<{
  workspaceId: string;
  setPending: (pending: boolean) => void;
  pending: boolean;
  organizations: Organization[];
}>) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const utils = trpc.useUtils();
  const [data] = trpc.workspace.getMembers.useSuspenseQuery();

  const FORM_SCHEMA = z.object({
    name: z.string().min(1, "Name is required"),
  });

  const form = useForm<z.infer<typeof FORM_SCHEMA>>({
    resolver: zodResolver(FORM_SCHEMA),
    defaultValues: {
      name: organizations.find((org) => org.id === workspaceId)?.name ?? "",
    },
  });

  const { handleDeleteWorkspace } = useFormSubmit();

  const { errors } = form.formState;

  const onSubmit = async (data: z.infer<typeof FORM_SCHEMA>) => {
    console.log(data);
    setPending(true);
    setError(null);
    try {
      await authClient.organization.update({
        data: {
          // required
          name: data.name,
          slug: data.name,
        },
        organizationId: workspaceId,
      });
      await utils.invalidate();
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
      {data.memberRole === "admin" || data.memberRole === "owner" ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-2'>
              <Label>Workspace Name</Label>
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
      ) : (
        <>
          <Label>Preferred Name</Label>
          <Input
            {...form.register("name")}
            className='max-w-3xs'
            disabled={pending}
            readOnly
          />
        </>
      )}
      {data.memberRole === "owner" && (
        <>
          <header className='flex shrink-0 items-center '>
            <h1 className='text-base'>Danger Zone</h1>
          </header>
          <Separator />
          <div className='flex flex-row gap-4 justify-between'>
            <Button
              variant={"destructive"}
              disabled={pending}
              onClick={async () => {
                await handleDeleteWorkspace();
              }}
            >
              Delete Entire Workspace
            </Button>
          </div>
        </>
      )}
    </>
  );
}
