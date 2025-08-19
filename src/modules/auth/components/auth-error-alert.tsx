"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";

interface AuthErrorAlertProps {
  error: string | null;
}

export const AuthErrorAlert = ({ error }: AuthErrorAlertProps) => {
  if (!error) return null;

  return (
    <Alert className='bg-destructive/10 text-center border-none'>
      <OctagonAlertIcon className='size-4 !text-destructive' />
      <AlertTitle>{error}</AlertTitle>
    </Alert>
  );
};
