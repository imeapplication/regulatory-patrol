
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { complianceData } from '@/data/complianceData';
import { Domain as ComplianceDomain } from '@/types/compliance';
import { Task, User } from '@/types/graphqlTypes';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import DomainInfo from '@/components/domain/DomainInfo';
import DomainTasks from '@/components/domain/DomainTasks';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Define a domain interface that works with our components
interface DomainForUI {
  id: string;
  title: string;
  description?: string;
  documentLink?: string;
  responsible?: User;
  startDate: string;
  endDate: string;
  mandays: number;
  tasks?: TaskForUI[];
}

interface TaskForUI {
  id: string;
  title: string;
  description?: string;
  documentLink?: string;
  startDate: string;
  endDate: string;
  mandays: number;
  status: number;
  owner?: User;
  subtasks?: TaskForUI[];
  actions?: any[];
}

const DomainDetail = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, currentUser } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<DomainForUI | null>(null);
  
  useEffect(() => {
    setLoading(true);
    // Find domain in complianceData
    if (domainId) {
      const complianceDomain = complianceData.regulations.domains.find(
        (d: ComplianceDomain) => d.name === decodeURIComponent(domainId)
      );
      
      if (complianceDomain) {
        // Map to the required format
        const mappedDomain: DomainForUI = {
          id: complianceDomain.name,
          title: complianceDomain.name,
          description: complianceDomain.description,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          mandays: complianceDomain.man_day_cost,
          responsible: complianceDomain.accountableRole ? {
            id: '1',
            firstName: complianceDomain.accountableRole,
            lastName: '',
            role: complianceDomain.accountableRole
          } : undefined,
          tasks: complianceDomain.tasks.map(task => ({
            id: task.name,
            title: task.name,
            description: task.description,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            mandays: task.man_day_cost,
            status: 0,
            owner: task.roles && task.roles.length > 0 ? {
              id: '1',
              firstName: task.roles[0],
              lastName: '',
              role: task.roles[0]
            } : undefined
          }))
        };
        
        setDomain(mappedDomain);
      }
    }
    setLoading(false);
  }, [domainId]);
  
  // Mock users for the accountable dropdown
  const accountableUsers = [
    { id: '1', name: 'DPO' },
    { id: '2', name: 'Environmental Officer' },
    { id: '3', name: 'Compliance Officer' },
    { id: '4', name: 'CFO' },
    { id: '5', name: 'Quality Director' }
  ];
  
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

  const handleTaskCreated = (newTask: Partial<TaskForUI>) => {
    toast({
      title: "Task Created",
      description: "Task has been successfully created.",
    });
    
    // In a real app, we'd update the domain with the new task
    // For now, we'll just simulate it
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
        owner: newTask.owner || currentUser
      };
      
      updatedDomain.tasks = [...(updatedDomain.tasks || []), newTaskObj];
      setDomain(updatedDomain);
    }
  };

  const canManageTasks = isAdmin || (currentUser?.id === assignedAccountableId);

  const onSelectTask = (task: TaskForUI) => {
    if (domain) {
      navigate(`/domain/${encodeURIComponent(domain.title)}/task/${encodeURIComponent(task.title)}`);
    }
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

  if (!domain) {
    return (
      <>
        <Navbar />
        <div className="pt-24 px-4 container mx-auto">
          <Card className="bg-white border-none shadow-lg animate-fade-in">
            <CardContent className="p-6">
              <p>Domain not found or error loading data.</p>
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
            <span className="font-medium text-foreground">{domain?.title}</span>
          </div>

          <Card className="border-none shadow-lg mb-8 overflow-hidden animate-slide-down">
            <CardContent className="p-0">
              <DomainInfo 
                domain={domain as any}
                domainName={domain?.title}
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
                domain={domain as any}
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
