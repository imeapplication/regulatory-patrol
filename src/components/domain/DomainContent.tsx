
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import DomainInfo from '@/components/domain/DomainInfo';
import DomainTasks from '@/components/domain/DomainTasks';
import { DomainForUI, TaskForUI } from '@/hooks/useDomainDetail';

interface DomainContentProps {
  domain: DomainForUI;
  setDomain: React.Dispatch<React.SetStateAction<DomainForUI | null>>;
  onSelectTask: (task: TaskForUI) => void;
}

const DomainContent = ({ domain, setDomain, onSelectTask }: DomainContentProps) => {
  const { toast } = useToast();
  const { isAdmin, currentUser, isDomainAccountableFor } = useUser();
  
  const assignedAccountableId = domain?.responsible?.id || '';
  
  const handleAccountableAssignment = (userId: string) => {
    toast({
      title: 'Domain Accountable Updated',
      description: `User assignment has been updated.`,
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
        owner: newTask.owner || (currentUser ? {
          id: currentUser.id,
          firstName: currentUser.name || '',
          lastName: '',
          role: currentUser.role || ''
        } : undefined)
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
