
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DomainDetailLayout from '@/components/domain/DomainDetailLayout';
import { useDomainDetail, TaskForUI } from '@/hooks/useDomainDetail';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useAllocationHistory } from '@/hooks/useAllocationHistory';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import TaskDetailHeader from '@/components/task/TaskDetailHeader';
import TaskInfoGrid from '@/components/task/TaskInfoGrid';
import TaskActions from '@/components/task/TaskActions';
import TaskNotFound from '@/components/task/TaskNotFound';
import TaskLoading from '@/components/task/TaskLoading';

const TaskDetail = () => {
  const { domainId, taskId } = useParams<{ domainId: string; taskId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, domain, setDomain } = useDomainDetail(domainId);
  const [task, setTask] = useState<TaskForUI | null>(null);
  const { getAllUsers, updateUser } = useUser();
  const { addAllocationHistoryEntry } = useAllocationHistory();
  
  // Initialize task management hooks with proper context
  const { updateTaskOwner } = useTaskManagement({
    users: getAllUsers(),
    updateUser,
    addAllocationHistoryEntry
  });

  useEffect(() => {
    if (domain && !loading && taskId) {
      const decodedTaskId = decodeURIComponent(taskId);
      const foundTask = domain.tasks?.find(t => t.title === decodedTaskId);
      
      if (foundTask) {
        setTask(foundTask);
      } else {
        toast({
          title: "Task not found",
          description: `Could not find task "${decodedTaskId}" in this domain.`,
          variant: "destructive",
        });
      }
    }
  }, [domain, loading, taskId, toast]);

  const handleBack = () => {
    navigate(`/domain/${domainId}`);
  };

  const handleOwnerChange = (userId: string) => {
    if (!task || !domain) return;
    
    const users = getAllUsers();
    const selectedUser = users.find(user => user.id === userId);
    
    if (!selectedUser) return;

    const updatedTask = {
      ...task,
      owner: {
        id: selectedUser.id,
        firstName: selectedUser.name.split(' ')[0] || selectedUser.name,
        lastName: selectedUser.name.split(' ')[1] || '',
        role: selectedUser.businessRole || selectedUser.role
      }
    };

    // Sync with the task management system to update user permissions
    updateTaskOwner(
      task.owner?.id, 
      userId, 
      domain.title, 
      task
    );

    if (domain.tasks) {
      const updatedTasks = domain.tasks.map(t => 
        t.title === task.title ? updatedTask : t
      );

      const updatedDomain = {
        ...domain,
        tasks: updatedTasks
      };

      setDomain(updatedDomain);
      setTask(updatedTask);

      toast({
        title: "Owner Updated",
        description: `Task owner has been updated to ${selectedUser.name}.`,
      });
    }
  };

  if (loading) {
    return (
      <DomainDetailLayout>
        <TaskLoading />
      </DomainDetailLayout>
    );
  }

  if (!task) {
    return (
      <DomainDetailLayout>
        <TaskNotFound onBack={handleBack} />
      </DomainDetailLayout>
    );
  }

  return (
    <DomainDetailLayout domainTitle={domain?.title}>
      <div className="space-y-6 animate-fade-in">
        <Card className="border-none shadow-lg overflow-hidden animate-slide-down">
          <CardContent className="p-6">
            <TaskDetailHeader task={task} />
            <TaskInfoGrid 
              task={task} 
              domainTitle={domain?.title || ''} 
              onOwnerChange={handleOwnerChange} 
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden animate-slide-up">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Actions</h2>
            <TaskActions task={task} onBack={handleBack} />
          </CardContent>
        </Card>
      </div>
    </DomainDetailLayout>
  );
};

export default TaskDetail;
