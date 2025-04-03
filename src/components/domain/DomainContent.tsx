
import React from 'react';
import { DomainForUI, TaskForUI } from '@/hooks/useDomainDetail';
import { Card, CardContent } from '@/components/ui/card';
import DomainInfo from './DomainInfo';
import DomainTasks from './DomainTasks';
import { User } from '@/types/compliance';
import { useUser } from '@/contexts/UserContext';
import { usePermissionChecks } from '@/hooks/usePermissionChecks';
import { useAllocationHistory } from '@/hooks/useAllocationHistory';

interface DomainContentProps {
  domain: DomainForUI;
  setDomain: React.Dispatch<React.SetStateAction<DomainForUI | null>>;
  onSelectTask: (task: TaskForUI) => void;
}

const DomainContent = ({ domain, setDomain, onSelectTask }: DomainContentProps) => {
  const { getAllUsers, updateUser } = useUser();
  const { checkCanManageDomain } = usePermissionChecks();
  const { addAllocationHistoryEntry } = useAllocationHistory();
  const canManageDomain = checkCanManageDomain(domain.title);

  const handleResponsibleChange = (userId: string) => {
    const users = getAllUsers();
    const selectedUser = users.find(user => user.id === userId);
    
    if (!selectedUser) return;
    
    // Get current owner ID for tracking changes
    const currentOwnerId = domain.responsible?.id;
    
    // Update domain with new responsible
    const updatedDomain = {
      ...domain,
      responsible: {
        id: selectedUser.id,
        firstName: selectedUser.name.split(' ')[0] || selectedUser.name,
        lastName: selectedUser.name.split(' ')[1] || '',
        role: selectedUser.businessRole || selectedUser.role
      },
      lastUpdated: new Date().toISOString()
    };
    
    // Update the domain state
    setDomain(updatedDomain);
    
    // Track when the owner was assigned - add to history
    const historyEntry = {
      userId: selectedUser.id,
      domainName: domain.title,
      action: 'assigned' as const,
      timestamp: new Date().toISOString(),
      role: 'DomainAccountable' as const
    };
    
    // Add allocation history
    addAllocationHistoryEntry(historyEntry);
    
    // Update user permissions if they don't already have this domain
    const updatedUser = {
      ...selectedUser,
      permissions: {
        ...selectedUser.permissions,
        accountableDomains: [
          ...(selectedUser.permissions.accountableDomains || []).filter(d => d !== domain.title),
          domain.title
        ]
      }
    };
    
    // Remove domain from previous owner's permissions if there was one
    if (currentOwnerId && currentOwnerId !== userId) {
      const previousOwner = users.find(user => user.id === currentOwnerId);
      if (previousOwner) {
        const updatedPreviousOwner = {
          ...previousOwner,
          permissions: {
            ...previousOwner.permissions,
            accountableDomains: (previousOwner.permissions.accountableDomains || [])
              .filter(d => d !== domain.title)
          }
        };
        
        // Update previous owner
        updateUser(updatedPreviousOwner);
        
        // Log removal from previous owner
        addAllocationHistoryEntry({
          userId: currentOwnerId,
          domainName: domain.title,
          action: 'removed',
          timestamp: new Date().toISOString(),
          role: 'DomainAccountable'
        });
      }
    }
    
    // Update the new owner's permissions
    updateUser(updatedUser);
  };

  const handleTaskCreated = (newTask: Partial<TaskForUI>) => {
    if (!newTask.id || !newTask.title) return;
    
    const task: TaskForUI = {
      id: newTask.id,
      title: newTask.title,
      description: newTask.description || '',
      status: newTask.status || 0,
      startDate: newTask.startDate || new Date().toISOString(),
      endDate: newTask.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      mandays: newTask.mandays || 1,
      owner: newTask.owner
    };
    
    const updatedTasks = [...(domain.tasks || []), task];
    
    setDomain({
      ...domain,
      tasks: updatedTasks
    });
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none shadow-lg">
        <CardContent className="p-6">
          <DomainInfo 
            domain={domain} 
            canEdit={canManageDomain} 
            onResponsibleChange={handleResponsibleChange}
          />
        </CardContent>
      </Card>
      
      <DomainTasks
        domain={domain}
        canManageTasks={canManageDomain}
        onTaskCreated={handleTaskCreated}
        onSelectTask={onSelectTask}
      />
    </div>
  );
};

export default DomainContent;
