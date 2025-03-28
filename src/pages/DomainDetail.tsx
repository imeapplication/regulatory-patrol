
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { complianceData } from '@/data/complianceData';
import { Domain, Task, UserRole } from '@/types/compliance';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import DomainInfo from '@/components/domain/DomainInfo';
import DomainTasks from '@/components/domain/DomainTasks';

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
    if (userId !== "none") {
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

  const handleTaskCreated = (newTask: Task) => {
    if (domain) {
      // Create a copy of the domain with the new task added
      const updatedDomain: Domain = {
        ...domain,
        tasks: [...domain.tasks, newTask]
      };
      
      // Update the domain in the state
      setDomain(updatedDomain);
      
      // Find the domain index in the regulations data
      const domainIndex = complianceData.regulations.domains.findIndex(d => d.name === domainName);
      if (domainIndex !== -1) {
        // Update the domain in the actual data source
        complianceData.regulations.domains[domainIndex] = updatedDomain;
      }
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

        <DomainInfo 
          domain={domain}
          domainName={domainName}
          isAdmin={isAdmin}
          accountableUsers={accountableUsers}
          assignedAccountableId={assignedAccountableId}
          onAssignAccountable={handleAccountableAssignment}
        />

        <DomainTasks 
          domain={domain}
          canManageTasks={canManageTasks}
          onTaskCreated={handleTaskCreated}
          onSelectTask={onSelectTask}
        />
      </div>
    </>
  );
};

export default DomainDetail;
