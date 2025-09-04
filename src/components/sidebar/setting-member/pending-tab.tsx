import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import { Invitation } from "@/lib/auth";

export function PendingTab({
  pendingMemberList,
}: Readonly<{ pendingMemberList: Invitation[] }>) {
  return (
    <TabsContent value='pending'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingMemberList.map((member) => (
            <TableRow key={member.id}>
              <TableCell className='font-medium'>{member.email}</TableCell>
              <TableCell>{member.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TabsContent>
  );
}
