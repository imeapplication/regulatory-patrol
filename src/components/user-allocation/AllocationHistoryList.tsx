
import React from 'react';
import { format, parseISO } from 'date-fns';
import { AllocationHistoryEntry } from '@/types/userAllocation';

interface AllocationHistoryListProps {
  historyEntries: AllocationHistoryEntry[];
}

const AllocationHistoryList = ({ historyEntries }: AllocationHistoryListProps) => {
  return (
    <div className="mb-6">
      <div className="text-sm font-medium mb-3">Allocation History</div>
      
      {historyEntries.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-2">
          {historyEntries.map((entry, index) => (
            <div key={index} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-medium">
                    {entry.action === 'assigned' ? 'Assigned to' : 'Removed from'} {entry.domainName || entry.taskName}
                  </span>
                  <div className="text-xs text-muted-foreground mt-1">
                    Role: {entry.role}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(parseISO(entry.timestamp), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground italic mt-2">
          No allocation history available
        </div>
      )}
    </div>
  );
};

export default AllocationHistoryList;
