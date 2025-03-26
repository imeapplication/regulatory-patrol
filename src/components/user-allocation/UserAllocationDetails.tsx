
import React from 'react';
import Badge from '@/components/ui-components/Badge';

interface UserAllocationDetailsProps {
  domains: string[];
  tasks: string[];
  totalManDays: number;
  date: Date;
}

const UserAllocationDetails = ({ domains, tasks, totalManDays, date }: UserAllocationDetailsProps) => {
  return (
    <div className="mb-6">
      <div className="text-sm font-medium flex items-center gap-2 mb-2">
        <span>Current Allocation</span>
        <Badge variant="outline" className="text-xs">
          {totalManDays} man-days
        </Badge>
      </div>
      
      {/* Show domains if applicable */}
      {domains.length > 0 && (
        <>
          <div className="text-sm font-medium mt-3 mb-2">Domains:</div>
          <div className="flex flex-wrap gap-2">
            {domains.map(domain => (
              <Badge key={domain} variant="secondary" className="text-xs">
                {domain}
              </Badge>
            ))}
          </div>
        </>
      )}
      
      {/* Show tasks if applicable */}
      {tasks && tasks.length > 0 && (
        <>
          <div className="text-sm font-medium mt-3 mb-2">Tasks:</div>
          <div className="flex flex-wrap gap-2">
            {tasks.map(task => (
              <Badge key={task} variant="secondary" className="text-xs bg-blue-100">
                {task}
              </Badge>
            ))}
          </div>
        </>
      )}
      
      {domains.length === 0 && (!tasks || tasks.length === 0) && (
        <div className="text-sm text-muted-foreground italic mt-2">
          No domains or tasks assigned at this time
        </div>
      )}
    </div>
  );
};

export default UserAllocationDetails;
