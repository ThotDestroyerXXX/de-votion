import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RoleDropdown({
  userId,
  organizationId,
  pending,
  setPending,
}: Readonly<{
  userId: string;
  organizationId: string;
  pending: boolean;
  setPending: (pending: boolean) => void;
}>) {
  const router = useRouter();
  const handleChangeRole = async (newRole: "member" | "admin" | "owner") => {
    setPending(true);
    try {
      await authClient.organization.updateMemberRole({
        role: newRole, // required
        memberId: userId, // required
        organizationId: organizationId,
      });
    } catch (error) {
      console.error("Failed to update member role:", error);
    } finally {
      setPending(false);
    }
    router.refresh();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 p-0'
          disabled={pending}
        >
          <EllipsisVertical className='size-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>Manage Roles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleChangeRole("admin")}
          disabled={pending}
        >
          Admin
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChangeRole("member")}
          disabled={pending}
        >
          Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
