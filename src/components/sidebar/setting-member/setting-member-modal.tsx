"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "../../ui/sidebar";
import { settingMemberSidebarData } from "@/constants/sidebar";
import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Separator } from "../../ui/separator";
import { MyAccount } from "./my-account";
import { Settings } from "./settings";
import { People } from "./people";
import { Organization } from "@/lib/auth";

export function SettingMemberModal({
  email,
  workspaceId,
  organizations,
}: Readonly<{
  email: string;
  workspaceId: string;
  organizations: Organization[];
}>) {
  const [activeBar, setActiveBar] = useState<string | null>("My Account");
  const [pending, setPending] = useState<boolean>(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Settings2 />
            <span>Settings & Members</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent className='overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]'>
        <DialogTitle className='sr-only' hidden>
          Settings
        </DialogTitle>
        <DialogDescription hidden className='sr-only'>
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider
          className='items-start'
          style={
            {
              "--sidebar-width": "12rem",
              "--sidebar-width-icon": "3rem",
            } as React.CSSProperties
          }
        >
          <Sidebar collapsible='icon'>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {settingMemberSidebarData.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          onClick={() => setActiveBar(item.name)}
                        >
                          <item.icon />
                          <span>{item.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className='flex flex-1 flex-col p-4 pt-0 overflow-hidden'>
            <header className='flex h-12 shrink-0 items-center gap-2 transition-[width] ease-linear '>
              <SidebarTrigger size={"sm"} />
              <h1 className='text-base'>{activeBar}</h1>
            </header>
            <Separator />
            <div className='flex flex-1 flex-col gap-4 py-4 overflow-y-auto '>
              {activeBar === "My Account" && (
                <MyAccount
                  pending={pending}
                  setPending={setPending}
                  email={email}
                />
              )}
              {activeBar === "Settings" && (
                <Settings
                  workspaceId={workspaceId}
                  setPending={setPending}
                  pending={pending}
                  organizations={organizations}
                />
              )}
              {activeBar === "People" && (
                <People
                  pending={pending}
                  setPending={setPending}
                  workspaceId={workspaceId}
                  email={email}
                />
              )}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
