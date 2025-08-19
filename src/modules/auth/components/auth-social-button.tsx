"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface AuthSocialButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => Promise<void>;
  disabled?: boolean;
}

export const AuthSocialButton = ({
  icon,
  label,
  onClick,
  disabled = false,
}: AuthSocialButtonProps) => {
  return (
    <Button
      type='button'
      variant='outline'
      className='w-full'
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};
