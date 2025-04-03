
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DomainDetailLayout from '@/components/domain/DomainDetailLayout';
import { useDomainDetail, TaskForUI } from '@/hooks/useDomainDetail';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Check, AlertCircle, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types/compliance';
import TaskOwnerSelect from '@/components/TaskOwnerSelect';
import { useAllocationHistory } from '@/hooks/useAllocationHistory';
import { useTaskManagement } from '@/hooks/useTaskManagement';

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

  const getStatusBadge = (status: number) => {
    switch(status) {
      case 0:
        return <Badge variant="outline" className="bg-gray-100">Not Started</Badge>;
      case 1:
        return <Badge variant="outline" className="bg-blue-100">In Progress</Badge>;
      case 2:
        return <Badge variant="outline" className="bg-green-100">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <DomainDetailLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </DomainDetailLayout>
    );
  }

  if (!task) {
    return (
      <DomainDetailLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-medium mb-2">Task Not Found</h2>
          <p className="text-muted-foreground mb-4">We couldn't find the task you're looking for.</p>
          <Button onClick={handleBack}>Back to Domain</Button>
        </div>
      </DomainDetailLayout>
    );
  }

  return (
    <DomainDetailLayout domainTitle={domain?.title}>
      <div className="space-y-6 animate-fade-in">
        <Card className="border-none shadow-lg overflow-hidden animate-slide-down">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold mb-2">{task?.title}</h1>
                <p className="text-gray-600">{task?.description}</p>
              </div>
              <div>
                {task && getStatusBadge(task.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Effort</div>
                  <div className="font-medium">{task?.mandays} man-days</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Timeline</div>
                  <div className="font-medium">
                    {task && formatDate(task.startDate)} - {task && formatDate(task.endDate)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Owner</div>
                  {domain && task && (
                    <TaskOwnerSelect 
                      task={task} 
                      domainTitle={domain.title} 
                      onOwnerChange={handleOwnerChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden animate-slide-up">
          <CardContent className="p-6">
            <h2 className="text-lg font-medium mb-4">Actions</h2>
            <div className="space-y-3">
              <div className="p-3 border rounded-md flex items-center justify-between">
                <div>
                  <div className="font-medium">Update task status</div>
                </div>
                <Button variant="outline" size="sm">
                  <Check className="w-4 h-4 mr-2" /> Mark as In Progress
                </Button>
              </div>
              <div className="p-3 border rounded-md flex items-center justify-between">
                <div>
                  <div className="font-medium">View related documents</div>
                </div>
                <Button variant="outline" size="sm" disabled={!task?.documentLink}>
                  {task?.documentLink ? "Open Document" : "No Document"}
                </Button>
              </div>
              <div className="p-3 border rounded-md flex items-center justify-between">
                <div>
                  <div className="font-medium">Return to domain</div>
                </div>
                <Button variant="outline" size="sm" onClick={handleBack}>
                  Back to Domain
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DomainDetailLayout>
  );
};

export default TaskDetail;
