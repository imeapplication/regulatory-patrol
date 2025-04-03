
import React from 'react';
import { Domain, User } from '@/types/compliance';
import DomainTable from './DomainTable';

interface AccountableTabProps {
  domains: Domain[];
  accountableUsers: User[];
  domainAccountableAssignments: {[key: string]: string};
  handleDomainAccountableAssignment: (domainName: string, userId: string | null) => void;
}

const AccountableTab = ({ 
  domains, 
  accountableUsers, 
  domainAccountableAssignments, 
  handleDomainAccountableAssignment 
}: AccountableTabProps) => {
  return (
    <>
      <p className="mb-4">
        Assign domain accountable users to specific domains. Each domain can have one accountable user who will be responsible for managing tasks within that domain.
      </p>
      
      {accountableUsers.length === 0 && (
        <div className="bg-yellow-50 p-4 rounded-md mb-4">
          <p className="text-yellow-700">
            No domain accountable users found. Create users with the "Domain Accountable" role first.
          </p>
        </div>
      )}
      
      <DomainTable 
        domains={domains}
        users={accountableUsers}
        assignments={domainAccountableAssignments}
        onAssignUser={handleDomainAccountableAssignment}
        label="Accountable"
      />
    </>
  );
};

export default AccountableTab;
