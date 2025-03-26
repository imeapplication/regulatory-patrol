
import { User, UserRole } from '@/types/compliance';
import { AllocationHistoryEntry } from '@/types/userAllocation';

interface DomainManagementProps {
  users: User[];
  updateUser: (user: User) => void;
  addAllocationHistoryEntry: (entry: AllocationHistoryEntry) => void;
}

export const useDomainManagement = ({ 
  users, 
  updateUser, 
  addAllocationHistoryEntry 
}: DomainManagementProps) => {
  
  // Function to assign a domain to a Domain Accountable
  const assignDomainToAccountable = (userId: string, domainName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate && userToUpdate.role === UserRole.DomainAccountable) {
      const accountableDomains = userToUpdate.permissions.accountableDomains || [];
      
      // Only add if not already assigned
      if (!accountableDomains.includes(domainName)) {
        const updatedUser = {
          ...userToUpdate,
          permissions: {
            ...userToUpdate.permissions,
            accountableDomains: [...accountableDomains, domainName]
          }
        };
        
        updateUser(updatedUser);
        
        // Add history entry
        const historyEntry: AllocationHistoryEntry = {
          userId,
          domainName,
          action: 'assigned',
          timestamp: new Date().toISOString(),
          role: 'DomainAccountable'
        };
        
        addAllocationHistoryEntry(historyEntry);
      }
    }
  };

  // Function to remove a domain from a Domain Accountable
  const removeDomainFromAccountable = (userId: string, domainName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate && userToUpdate.role === UserRole.DomainAccountable) {
      const accountableDomains = userToUpdate.permissions.accountableDomains || [];
      
      if (accountableDomains.includes(domainName)) {
        const updatedUser = {
          ...userToUpdate,
          permissions: {
            ...userToUpdate.permissions,
            accountableDomains: accountableDomains.filter(domain => domain !== domainName)
          }
        };
        
        updateUser(updatedUser);
        
        // Add history entry
        const historyEntry: AllocationHistoryEntry = {
          userId,
          domainName,
          action: 'removed',
          timestamp: new Date().toISOString(),
          role: 'DomainAccountable'
        };
        
        addAllocationHistoryEntry(historyEntry);
      }
    }
  };

  // Function to assign a domain to a Domain Manager
  const assignDomainToManager = (userId: string, domainName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate && userToUpdate.role === UserRole.DomainManager) {
      const manageableDomains = userToUpdate.permissions.manageableDomains || [];
      
      // Only add if not already assigned
      if (!manageableDomains.includes(domainName)) {
        const updatedUser = {
          ...userToUpdate,
          permissions: {
            ...userToUpdate.permissions,
            manageableDomains: [...manageableDomains, domainName]
          }
        };
        
        updateUser(updatedUser);
        
        // Add history entry
        const historyEntry: AllocationHistoryEntry = {
          userId,
          domainName,
          action: 'assigned',
          timestamp: new Date().toISOString(),
          role: 'DomainManager'
        };
        
        addAllocationHistoryEntry(historyEntry);
      }
    }
  };

  // Function to remove a domain from a Domain Manager
  const removeDomainFromManager = (userId: string, domainName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate && userToUpdate.role === UserRole.DomainManager) {
      const manageableDomains = userToUpdate.permissions.manageableDomains || [];
      
      if (manageableDomains.includes(domainName)) {
        const updatedUser = {
          ...userToUpdate,
          permissions: {
            ...userToUpdate.permissions,
            manageableDomains: manageableDomains.filter(domain => domain !== domainName)
          }
        };
        
        updateUser(updatedUser);
        
        // Add history entry
        const historyEntry: AllocationHistoryEntry = {
          userId,
          domainName,
          action: 'removed',
          timestamp: new Date().toISOString(),
          role: 'DomainManager'
        };
        
        addAllocationHistoryEntry(historyEntry);
      }
    }
  };

  return {
    assignDomainToAccountable,
    removeDomainFromAccountable,
    assignDomainToManager,
    removeDomainFromManager
  };
};
