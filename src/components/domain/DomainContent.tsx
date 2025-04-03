
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import DomainInfo from '@/components/domain/DomainInfo';
import DomainTasks from '@/components/domain/DomainTasks';
import { DomainForUI, TaskForUI } from '@/hooks/useDomainDetail';
import { useDomainManagement } from '@/hooks/useDomainManagement';
import { useAllocationHistory } from '@/hooks/useAllocationHistory';

interface DomainContentProps {
  domain: DomainForUI;
  setDomain: React.Dispatch<React.SetStateAction<DomainForUI | null>>;
  onSelectTask: (task: TaskForUI) => void;
}

const DomainContent = ({ domain, setDomain, onSelectTask }: DomainContentProps) => {
  const { toast } = useToast();
  const { isAdmin, currentUser, getAllUsers, updateUser } = useUser();
  const { addAllocationHistoryEntry } = useAllocationHistory();
  const [assignedAccountableId, setAssignedAccountableId] = useState<string>('');
  
  // Initialize domain management hooks
  const { assignDomainToAccountable, removeDomainFromAccountable } = useDomainManagement({
    users: getAllUsers(),
    updateUser,
    addAllocationHistoryEntry
  });
  
  // Set initial assigned accountable ID when domain loads
  useEffect(() => {
    if (domain?.responsible?.id) {
      setAssignedAccountableId(domain.responsible.id);
    } else {
      setAssignedAccountableId('');
      
      // Check if this domain is assigned to any accountable in user data
      const users = getAllUsers();
      const accountableWithDomain = users.find(user => 
        user.permissions.accountableDomains?.includes(domain.title)
      );
      
      if (accountableWithDomain) {
        // If found in user permissions but not in domain object, update the domain
        const updatedDomain = {
          ...domain,
          responsible: {
            id: accountableWithDomain.id,
            firstName: accountableWithDomain.name.split(' ')[0] || '',
            lastName: accountableWithDomain.name.split(' ')[1] || '',
            role: accountableWithDomain.businessRole || accountableWithDomain.role
          }
        };
        
        setDomain(updatedDomain);
        setAssignedAccountableId(accountableWithDomain.id);
      }
    }
  }, [domain, getAllUsers, setDomain]);

  const handleAccountableAssignment = (userId: string) => {
    // Remove previous accountable if exists
    if (assignedAccountableId && domain.title) {
      removeDomainFromAccountable(assignedAccountableId, domain.title);
    }
    
    // Assign new accountable if not empty
    if (userId && domain.title) {
      assignDomainToAccountable(userId, domain.title);
      
      // Update domain responsible in UI
      const users = getAllUsers();
      const selectedUser = users.find(user => user.id === userId);
      
      if (selectedUser) {
        const updatedDomain = {
          ...domain,
          responsible: {
            id: selectedUser.id,
            firstName: selectedUser.name.split(' ')[0] || '',
            lastName: selectedUser.name.split(' ')[1] || '',
            role: selectedUser.businessRole || selectedUser.role
          }
        };
        
        setDomain(updatedDomain);
        setAssignedAccountableId(userId);
      }
    } else {
      // Remove accountable assignment
      const updatedDomain = {
        ...domain,
        responsible: undefined
      };
      
      setDomain(updatedDomain);
      setAssignedAccountableId('');
    }
    
    toast({
      title: 'Domain Accountable Updated',
      description: userId ? `Domain accountable has been assigned.` : `Domain accountable has been removed.`,
    });
  };

  const handleTaskCreated = (newTask: Partial<TaskForUI>) => {
    toast({
      title: "Task Created",
      description: "Task has been successfully created.",
    });
    
    if (domain && newTask.title) {
      const updatedDomain = { ...domain };
      const newTaskObj: TaskForUI = {
        id: `task-${Date.now()}`,
        title: newTask.title,
        description: newTask.description,
        documentLink: newTask.documentLink,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        mandays: newTask.mandays || 1,
        status: 0,
        owner: newTask.owner
      };
      
      updatedDomain.tasks = [...(updatedDomain.tasks || []), newTaskObj];
      setDomain(updatedDomain);
    }
  };

  const canManageTasks = isAdmin || (currentUser?.id === assignedAccountableId);

  return (
    <>
      <Card className="border-none shadow-lg mb-8 overflow-hidden animate-slide-down">
        <CardContent className="p-0">
          <DomainInfo 
            domain={domain as any}
            domainName={domain?.title}
            isAdmin={isAdmin}
            assignedAccountableId={assignedAccountableId}
            onAssignAccountable={handleAccountableAssignment}
          />
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg overflow-hidden animate-slide-up">
        <CardContent className="p-0">
          <DomainTasks 
            domain={domain as any}
            canManageTasks={canManageTasks}
            onTaskCreated={handleTaskCreated}
            onSelectTask={onSelectTask}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default DomainContent;
