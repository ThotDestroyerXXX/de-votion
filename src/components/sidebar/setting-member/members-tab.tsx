import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Member } from "@/lib/auth";
import { RoleDropdown } from "./role-dropdown";

export function MembersTab({
  memberList,
  memberRole,
  pending,
  setPending,
  email,
}: Readonly<{
  memberList: Member[];
  memberRole: string;
  pending: boolean;
  setPending: (pending: boolean) => void;
  email: string;
}>) {
  return (
    <TabsContent value='member'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            {(memberRole === "admin" || memberRole === "owner") && (
              <TableHead className='w-4' />
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberList.map((member) => (
            <TableRow key={member.id}>
              <TableCell className='font-medium'>{member.user.name}</TableCell>
              <TableCell>{member.user.email}</TableCell>
              <TableCell>{member.role}</TableCell>
              {(memberRole === "admin" || memberRole === "owner") &&
                member.role !== "owner" &&
                member.user.email !== email && (
                  <TableCell className='w-4'>
                    <RoleDropdown
                      userId={member.id}
                      organizationId={member.organizationId}
                      pending={pending}
                      setPending={setPending}
                    />
                  </TableCell>
                )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TabsContent>
  );
}
