
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Users } from 'lucide-react';
import { format } from 'date-fns';

interface AllocationEntry {
  user: any;
  domains: string[];
  tasks: Array<{domain: string, task: string}>;
  totalManDays: number;
}

interface AllocationTableProps {
  allocations: AllocationEntry[];
  selectedDate: Date;
}

const AllocationTable = ({ allocations, selectedDate }: AllocationTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          User Allocations as of {format(selectedDate, 'MMMM d, yyyy')}
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Assignments</TableHead>
              <TableHead className="text-right">Total Man-Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map(allocation => (
              <TableRow key={allocation.user.id}>
                <TableCell className="font-medium">{allocation.user.name}</TableCell>
                <TableCell>{allocation.user.role}</TableCell>
                <TableCell>
                  {/* Show domains */}
                  {allocation.domains.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {allocation.domains.map(domain => (
                        <span 
                          key={domain} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Show tasks */}
                  {allocation.tasks.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {allocation.tasks.map((task, idx) => (
                        <span 
                          key={`${task.domain}-${task.task}-${idx}`} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          {task.task}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {allocation.domains.length === 0 && allocation.tasks.length === 0 && (
                    <span className="text-muted-foreground text-sm">No assignments</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {allocation.totalManDays > 0 ? (
                    <span className="font-medium">{allocation.totalManDays}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            
            {allocations.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No user allocations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllocationTable;
