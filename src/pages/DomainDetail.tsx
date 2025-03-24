
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { complianceData } from '@/data/complianceData';
import { Domain, Task, UserRole } from '@/types/compliance';
import Navbar from '@/components/Navbar';
import TaskList from '@/components/TaskList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const DomainDetail = () => {
  const { domainName } = useParams<{ domainName: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isDomainAccountableFor, getAllUsers, assignDomainToAccountable, removeDomainFromAccountable } = useUser();
  
  const [domain, setDomain] = useState<Domain | null>(null);
  const [accountableUsers, setAccountableUsers] = useState<{ id: string; name: string }[]>([]);
  const [assignedAccountableId, setAssignedAccountableId] = useState<string>('');

  useEffect(() => {
    // Find the domain by name
    const foundDomain = complianceData.regulations.domains.find(
      (d) => d.name === domainName
    );
    setDomain(foundDomain || null);

    // Load domain accountable users
    if (isAdmin) {
      const allUsers = getAllUsers();
      const domainAccountables = allUsers.filter(user => user.role === UserRole.DomainAccountable);
      setAccountableUsers(domainAccountables.map(user => ({ id: user.id, name: user.name })));
      
      // Find the currently assigned accountable user
      const assignedUser = domainAccountables.find(user => 
        user.permissions.accountableDomains?.includes(domainName || '')
      );
      
      if (assignedUser) {
        setAssignedAccountableId(assignedUser.id);
      }
    }
  }, [domainName, getAllUsers, isAdmin]);

  const handleAccountableAssignment = (userId: string) => {
    // If there was a previous assignment, remove it
    if (assignedAccountableId) {
      removeDomainFromAccountable(assignedAccountableId, domainName || '');
    }
    
    // If a new user is selected (not "None"), assign the domain
    if (userId) {
      assignDomainToAccountable(userId, domainName || '');
      setAssignedAccountableId(userId);
      
      const selectedUser = accountableUsers.find(user => user.id === userId);
      toast({
        title: 'Domain Accountable Assigned',
        description: `${selectedUser?.name} is now accountable for ${domainName}`,
      });
    } else {
      // If "None" was selected, just remove the assignment
      setAssignedAccountableId('');
      toast({
        title: 'Domain Accountable Removed',
        description: `No user is accountable for ${domainName} now`,
      });
    }
  };

  if (!domain) {
    return (
      <>
        <Navbar />
        <div className="pt-24 px-4 container mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Domain not found.</p>
            <Button asChild className="mt-4">
              <Link to="/">Go Back</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  const canManageTasks = isAdmin || isDomainAccountableFor(domainName || '');

  const onSelectTask = (task: Task) => {
    navigate(`/domain/${domainName}/task/${task.name}`);
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 px-4 container mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-2xl font-bold">{domain.name}</h1>
            
            {isAdmin && (
              <div className="mt-4 md:mt-0 w-full md:w-64">
                <Select
                  value={assignedAccountableId}
                  onValueChange={handleAccountableAssignment}
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

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Tasks</h2>
            {canManageTasks && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm">Add Task</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  {/* Task creation form would go here */}
                  <div className="p-4">
                    <p>Task creation functionality will be implemented later</p>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
          
          <TaskList 
            tasks={domain.tasks} 
            onSelectTask={onSelectTask}
          />
        </div>
      </div>
    </>
  );
};

export default DomainDetail;
