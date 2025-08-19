"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuthFormFooterProps {
  label: string;
  linkText: string;
  linkHref: string;
  disabled?: boolean;
}

export const AuthFormFooter = ({
  label,
  linkText,
  linkHref,
  disabled = false,
}: AuthFormFooterProps) => {
  return (
    <p className='text-accent-foreground text-center text-sm'>
      {label}
      <Button asChild variant='link' className='px-2' disabled={disabled}>
        <Link href={linkHref}>{linkText}</Link>
      </Button>
    </p>
  );
};
