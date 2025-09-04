import { SquarePen } from "lucide-react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

export function CreateWorkspaceLogo() {
  const router = useRouter();
  return (
    <SidebarMenu className='w-fit'>
      <SidebarMenuItem
        className='pr-3 cursor-pointer'
        onClick={() => {
          router.push("/workspace");
        }}
      >
        <SquarePen className='size-4.5 shrink-0' />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
