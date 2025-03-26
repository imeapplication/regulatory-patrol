
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import { complianceData } from '@/data/complianceData';
import { Domain, User, UserRole } from '@/types/compliance';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    const filteredAccountableUsers = allUsers.filter(user => user.role === UserRole.DomainAccountable);
    setAccountableUsers(filteredAccountableUsers);
    
    // Filter users to get only Domain Manager users
    const filteredManagerUsers = allUsers.filter(user => user.role === UserRole.DomainManager);
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
              <p className="mb-4">
                Assign domain accountable users to specific domains. Each domain can have one accountable user who will be responsible for managing tasks within that domain.
              </p>
              
              {accountableUsers.length === 0 && (
                <div className="bg-yellow-50 p-4 rounded-md mb-4">
                  <p className="text-yellow-700">
                    No domain accountable users found. Create users with the "Domain Accountable" role first.
                  </p>
                </div>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Assigned Accountable</TableHead>
                    <TableHead className="w-48">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.map((domain) => (
                    <TableRow key={domain.name}>
                      <TableCell className="font-medium">{domain.name}</TableCell>
                      <TableCell className="max-w-md truncate">{domain.description}</TableCell>
                      <TableCell>
                        {domainAccountableAssignments[domain.name] ? (
                          accountableUsers.find(user => user.id === domainAccountableAssignments[domain.name])?.name || 'Unknown'
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={domainAccountableAssignments[domain.name] || ''}
                          onValueChange={(value) => handleDomainAccountableAssignment(domain.name, value || null)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Assign user" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {accountableUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="manager">
              <p className="mb-4">
                Assign domain manager users to specific domains. Each domain can have one manager user who will be responsible for overseeing domain activities.
              </p>
              
              {managerUsers.length === 0 && (
                <div className="bg-yellow-50 p-4 rounded-md mb-4">
                  <p className="text-yellow-700">
                    No domain manager users found. Create users with the "Domain Manager" role first.
                  </p>
                </div>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Assigned Manager</TableHead>
                    <TableHead className="w-48">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.map((domain) => (
                    <TableRow key={`manager-${domain.name}`}>
                      <TableCell className="font-medium">{domain.name}</TableCell>
                      <TableCell className="max-w-md truncate">{domain.description}</TableCell>
                      <TableCell>
                        {domainManagerAssignments[domain.name] ? (
                          managerUsers.find(user => user.id === domainManagerAssignments[domain.name])?.name || 'Unknown'
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={domainManagerAssignments[domain.name] || ''}
                          onValueChange={(value) => handleDomainManagerAssignment(domain.name, value || null)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Assign user" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {managerUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default DomainAllocation;
