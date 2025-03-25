
import React from 'react';
import { Domain } from '@/types/compliance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

interface DomainInfoProps {
  domain: Domain;
  domainName: string | undefined;
  isAdmin: boolean;
  accountableUsers: { id: string; name: string }[];
  assignedAccountableId: string;
  onAssignAccountable: (userId: string) => void;
}

const DomainInfo = ({
  domain,
  domainName,
  isAdmin,
  accountableUsers,
  assignedAccountableId,
  onAssignAccountable,
}: DomainInfoProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-bold">{domain.name}</h1>
        
        {isAdmin && (
          <div className="mt-4 md:mt-0 w-full md:w-64">
            <Select
              value={assignedAccountableId}
              onValueChange={onAssignAccountable}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Assign Domain Accountable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {accountableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {assignedAccountableId && (
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Domain Accountable:</span>{' '}
            {accountableUsers.find(user => user.id === assignedAccountableId)?.name}
          </p>
        </div>
      )}

      <p className="text-gray-700 mb-4">{domain.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
          <span className="font-medium">Effort:</span> {domain.man_day_cost} man-days
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
          <span className="font-medium">Tasks:</span> {domain.tasks.length}
        </div>
        {domain.accountableRole && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            <span className="font-medium">Accountable Role:</span> {domain.accountableRole}
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainInfo;
