"use client"


import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface AdminLog {
  email: string;
  action: string;
  created_at: string;
}

export default function AdminLogs({ logs }: { logs: AdminLog[] }) {

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">No admin logs found.</TableCell>
            </TableRow>
          ) : (
            logs.map((log: AdminLog, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{log.email}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
