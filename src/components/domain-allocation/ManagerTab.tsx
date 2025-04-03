
import React from 'react';
import { Domain, User } from '@/types/compliance';
import DomainTable from './DomainTable';

interface ManagerTabProps {
  domains: Domain[];
  managerUsers: User[];
  domainManagerAssignments: {[key: string]: string};
  handleDomainManagerAssignment: (domainName: string, userId: string | null) => void;
}

const ManagerTab = ({ 
  domains, 
  managerUsers, 
  domainManagerAssignments, 
  handleDomainManagerAssignment 
}: ManagerTabProps) => {
  return (
    <>
      <p className="mb-4">
        Assign domain manager users to specific domains. Each domain can have one manager user who will be responsible for overseeing domain activities.
      </p>
      
      {managerUsers.length === 0 && (
        <div className="bg-yellow-50 p-4 rounded-md mb-4">
          <p className="text-yellow-700">
            No domain manager users found. Create users with the "Domain Manager" role first.
          </p>
        </div>
      )}
      
      <DomainTable 
        domains={domains}
        users={managerUsers}
        assignments={domainManagerAssignments}
        onAssignUser={handleDomainManagerAssignment}
        label="Manager"
      />
    </>
  );
};

export default ManagerTab;
