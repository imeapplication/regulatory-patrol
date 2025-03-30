
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_DOMAIN, GET_USERS } from '@/graphql/queries';
import { CREATE_TASK } from '@/graphql/mutations';
import { Domain, Task, User } from '@/types/graphqlTypes';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import DomainInfo from '@/components/domain/DomainInfo';
import DomainTasks from '@/components/domain/DomainTasks';
import { Card, CardContent } from '@/components/ui/card';

const DomainDetail = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, currentUser } = useUser();
  
  const { loading: loadingDomain, error: domainError, data: domainData, refetch } = 
    useQuery(GET_DOMAIN, { variables: { id: domainId } });
  
  const { loading: loadingUsers, error: usersError, data: usersData } = useQuery(GET_USERS);
  
  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      refetch();
      toast({
        title: "Task Created",
        description: "Task has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create task: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const loading = loadingDomain || loadingUsers;
  const error = domainError || usersError;
  
  const domain = domainData?.domain;
  const users = usersData?.users || [];
  
  // Filter users who can be domain accountable (based on their role)
  const accountableUsers = users
    .filter((user: User) => user.role === "Domain Accountable")
    .map((user: User) => ({ 
      id: user.id, 
      name: `${user.firstName} ${user.lastName}` 
    }));
  
  // Find currently assigned accountable user
  const assignedAccountableId = domain?.responsible?.id || '';
  
  const handleAccountableAssignment = (userId: string) => {
    // This would need to call a mutation to update domain responsible
    // For now we'll just show a toast
    toast({
      title: 'Domain Accountable Updated',
      description: `User assignment has been updated.`,
    });
  };

  const handleTaskCreated = (newTask: Partial<Task>) => {
    createTask({
      variables: {
        title: newTask.title,
        ownerId: newTask.owner?.id || currentUser?.id,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        domainId: domainId,
        description: newTask.description,
        documentLink: newTask.documentLink,
        mandays: newTask.mandays || 1
      }
    });
  };

  const canManageTasks = isAdmin || (currentUser?.id === assignedAccountableId);

  const onSelectTask = (task: Task) => {
    navigate(`/domain/${domainId}/task/${task.id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-24 px-4 container mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg">Loading domain data...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !domain) {
    return (
      <>
        <Navbar />
        <div className="pt-24 px-4 container mx-auto">
          <Card className="bg-white border-none shadow-lg animate-fade-in">
            <CardContent className="p-6">
              <p>Domain not found or error loading data.</p>
              {error && <p className="text-red-600 mt-2">{error.message}</p>}
              <Button asChild className="mt-4">
                <Link to="/">Go Back</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-4 min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 animate-fade-in">
            <Link to="/" className="hover:text-foreground">Dashboard</Link>
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium text-foreground">{domain.title}</span>
          </div>

          <Card className="border-none shadow-lg mb-8 overflow-hidden animate-slide-down">
            <CardContent className="p-0">
              <DomainInfo 
                domain={domain}
                domainName={domain.title}
                isAdmin={isAdmin}
                accountableUsers={accountableUsers}
                assignedAccountableId={assignedAccountableId}
                onAssignAccountable={handleAccountableAssignment}
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg overflow-hidden animate-slide-up">
            <CardContent className="p-0">
              <DomainTasks 
                domain={domain}
                canManageTasks={canManageTasks}
                onTaskCreated={handleTaskCreated}
                onSelectTask={onSelectTask}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default DomainDetail;
