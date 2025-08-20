"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";

export function ErrorAlert({ message }: Readonly<{ message: string }>) {
  return (
    <Alert className='bg-destructive/10 text-center border-none'>
      <OctagonAlertIcon className='size-4 !text-destructive' />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
}
