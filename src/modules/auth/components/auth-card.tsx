"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const AuthCard = ({
  title,
  description,
  children,
  footer,
}: AuthCardProps) => {
  return (
    <section className='flex pt-16 px-4'>
      <Card className='m-auto h-fit w-full max-w-md overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 gap-4'>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl font-semibold'>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer && <CardFooter className='justify-center'>{footer}</CardFooter>}
      </Card>
    </section>
  );
};
