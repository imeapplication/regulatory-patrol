
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import { complianceData } from '@/data/complianceData';
import { Domain, User } from '@/types/compliance';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountableTab from '@/components/domain-allocation/AccountableTab';
import ManagerTab from '@/components/domain-allocation/ManagerTab';

const DomainAllocation = () => {
  const { 
    isAdmin, 
    getAllUsers, 
    assignDomainToAccountable, 
    removeDomainFromAccountable,
    assignDomainToManager,
    removeDomainFromManager 
  } = useUser();
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>(complianceData.regulations.domains);
  const [accountableUsers, setAccountableUsers] = useState<User[]>([]);
  const [managerUsers, setManagerUsers] = useState<User[]>([]);
  const [domainAccountableAssignments, setDomainAccountableAssignments] = useState<{[key: string]: string}>({});
  const [domainManagerAssignments, setDomainManagerAssignments] = useState<{[key: string]: string}>({});
  const [activeTab, setActiveTab] = useState<string>("accountable");

  useEffect(() => {
    // Get all users
    const allUsers = getAllUsers();
    
    // Filter users to get only Domain Accountable users
    const filteredAccountableUsers = allUsers.filter(user => user.role === 'DomainAccountable');
    setAccountableUsers(filteredAccountableUsers);
    
    // Filter users to get only Domain Manager users
    const filteredManagerUsers = allUsers.filter(user => user.role === 'DomainManager');
    setManagerUsers(filteredManagerUsers);
    
    // Initialize domain accountable assignments from current user permissions
    const initialAccountableAssignments: {[key: string]: string} = {};
    domains.forEach(domain => {
      const assignedUser = filteredAccountableUsers.find(user => 
        user.permissions.accountableDomains?.includes(domain.name)
      );
      if (assignedUser) {
        initialAccountableAssignments[domain.name] = assignedUser.id;
      }
    });
    setDomainAccountableAssignments(initialAccountableAssignments);
    
    // Initialize domain manager assignments from current user permissions
    const initialManagerAssignments: {[key: string]: string} = {};
    domains.forEach(domain => {
      const assignedUser = filteredManagerUsers.find(user => 
        user.permissions.manageableDomains?.includes(domain.name)
      );
      if (assignedUser) {
        initialManagerAssignments[domain.name] = assignedUser.id;
      }
    });
    setDomainManagerAssignments(initialManagerAssignments);
  }, [getAllUsers]);

  const handleDomainAccountableAssignment = (domainName: string, userId: string | null) => {
    // If previous assignment exists, remove it
    const previousUserId = domainAccountableAssignments[domainName];
    if (previousUserId) {
      removeDomainFromAccountable(previousUserId, domainName);
    }
    
    // If new assignment, add it
    if (userId) {
      assignDomainToAccountable(userId, domainName);
      setDomainAccountableAssignments(prev => ({
        ...prev,
        [domainName]: userId
      }));
      
      const user = accountableUsers.find(u => u.id === userId);
      toast({
        title: 'Domain assigned',
        description: `${domainName} has been assigned to ${user?.name} as Domain Accountable`,
      });
    } else {
      // If userId is null, just remove the assignment
      setDomainAccountableAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[domainName];
        return newAssignments;
      });
      
      toast({
        title: 'Domain unassigned',
        description: `${domainName} has been unassigned from Domain Accountable`,
      });
    }
  };

  const handleDomainManagerAssignment = (domainName: string, userId: string | null) => {
    // If previous assignment exists, remove it
    const previousUserId = domainManagerAssignments[domainName];
    if (previousUserId) {
      removeDomainFromManager(previousUserId, domainName);
    }
    
    // If new assignment, add it
    if (userId) {
      assignDomainToManager(userId, domainName);
      setDomainManagerAssignments(prev => ({
        ...prev,
        [domainName]: userId
      }));
      
      const user = managerUsers.find(u => u.id === userId);
      toast({
        title: 'Domain assigned',
        description: `${domainName} has been assigned to ${user?.name} as Domain Manager`,
      });
    } else {
      // If userId is null, just remove the assignment
      setDomainManagerAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[domainName];
        return newAssignments;
      });
      
      toast({
        title: 'Domain unassigned',
        description: `${domainName} has been unassigned from Domain Manager`,
      });
    }
  };

  // Check if user has admin permissions
  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="pt-24 px-4 container mx-auto">
          <h1 className="text-2xl font-bold mb-6">Domain Allocation</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>You don't have permission to access this page.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 px-4 container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Domain Allocation</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="accountable">Domain Accountable</TabsTrigger>
              <TabsTrigger value="manager">Domain Manager</TabsTrigger>
            </TabsList>
            
            <TabsContent value="accountable">
              <AccountableTab 
                domains={domains}
                accountableUsers={accountableUsers}
                domainAccountableAssignments={domainAccountableAssignments}
                handleDomainAccountableAssignment={handleDomainAccountableAssignment}
              />
            </TabsContent>
            
            <TabsContent value="manager">
              <ManagerTab 
                domains={domains}
                managerUsers={managerUsers}
                domainManagerAssignments={domainManagerAssignments}
                handleDomainManagerAssignment={handleDomainManagerAssignment}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default DomainAllocation;
