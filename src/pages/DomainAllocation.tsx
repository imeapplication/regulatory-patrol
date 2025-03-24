
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import { complianceData } from '@/data/complianceData';
import { Domain, User, UserRole } from '@/types/compliance';
import { Button } from '@/components/ui/button';
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

const DomainAllocation = () => {
  const { isAdmin, getAllUsers, assignDomainToAccountable, removeDomainFromAccountable } = useUser();
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>(complianceData.regulations.domains);
  const [accountableUsers, setAccountableUsers] = useState<User[]>([]);
  const [domainAssignments, setDomainAssignments] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Filter users to get only Domain Accountable users
    const allUsers = getAllUsers();
    const filteredUsers = allUsers.filter(user => user.role === UserRole.DomainAccountable);
    setAccountableUsers(filteredUsers);
    
    // Initialize domain assignments from current user permissions
    const initialAssignments: {[key: string]: string} = {};
    domains.forEach(domain => {
      const assignedUser = filteredUsers.find(user => 
        user.permissions.accountableDomains?.includes(domain.name)
      );
      if (assignedUser) {
        initialAssignments[domain.name] = assignedUser.id;
      }
    });
    setDomainAssignments(initialAssignments);
  }, [getAllUsers]);

  const handleDomainAssignment = (domainName: string, userId: string | null) => {
    // If previous assignment exists, remove it
    const previousUserId = domainAssignments[domainName];
    if (previousUserId) {
      removeDomainFromAccountable(previousUserId, domainName);
    }
    
    // If new assignment, add it
    if (userId) {
      assignDomainToAccountable(userId, domainName);
      setDomainAssignments(prev => ({
        ...prev,
        [domainName]: userId
      }));
      
      const user = accountableUsers.find(u => u.id === userId);
      toast({
        title: 'Domain assigned',
        description: `${domainName} has been assigned to ${user?.name}`,
      });
    } else {
      // If userId is null, just remove the assignment
      setDomainAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[domainName];
        return newAssignments;
      });
      
      toast({
        title: 'Domain unassigned',
        description: `${domainName} has been unassigned`,
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
                    {domainAssignments[domain.name] ? (
                      accountableUsers.find(user => user.id === domainAssignments[domain.name])?.name || 'Unknown'
                    ) : (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={domainAssignments[domain.name] || ''}
                      onValueChange={(value) => handleDomainAssignment(domain.name, value || null)}
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
        </div>
      </div>
    </>
  );
};

export default DomainAllocation;
