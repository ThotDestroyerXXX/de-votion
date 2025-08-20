"use client";

import * as React from "react";
import { ChevronDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Organization } from "@/lib/auth";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function TeamSwitcher({
  username,
  email,
  organizations,
}: Readonly<{
  username: string;
  email: string;
  organizations: Organization[];
}>) {
  const router = useRouter();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className='w-full flex flex-row items-center justify-between cursor-pointer'>
              <span className='truncate font-medium'>{`${username}'s deVotion`}</span>
              <ChevronDown className='opacity-50' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-64 rounded-lg'
            align='start'
            side='bottom'
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>
              {email}
            </DropdownMenuLabel>
            {organizations.map((org, index) => (
              <DropdownMenuItem key={org.name} className='gap-2 p-2'>
                <div className='flex size-6 items-center justify-center rounded-xs border'>
                  {org.logo && (
                    <Image
                      src={org.logo}
                      alt='org logo'
                      width={24}
                      height={24}
                      className='size-4 shrink-0'
                    />
                  )}
                </div>
                {org.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='gap-2'
              onClick={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                });
              }}
            >
              <div className='flex size-6 items-center justify-center rounded-md border bg-red-500'>
                <LogOut className='size-4 text-white' />
              </div>
              <p className=' font-medium text-red-500'>Logout</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
