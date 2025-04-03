
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
    
    if (userToUpdate) {
      // Check if user is already a Domain Accountable, if not, this is an error
      if (userToUpdate.role !== UserRole.DomainAccountable) {
        console.error(`Cannot assign domain to user ${userId}, user is not a Domain Accountable`);
        return false;
      }
      
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
        
        // Update user in the system
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
        return true;
      }
    }
    
    return false;
  };

  // Function to remove a domain from a Domain Accountable
  const removeDomainFromAccountable = (userId: string, domainName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate) {
      // Check if user has domain accountable permissions
      if (userToUpdate.role === UserRole.DomainAccountable) {
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
          return true;
        }
      }
    }
    
    return false;
  };

  // Function to assign a domain to a Domain Manager
  const assignDomainToManager = (userId: string, domainName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate) {
      // Check if user is already a Domain Manager
      if (userToUpdate.role !== UserRole.DomainManager) {
        console.error(`Cannot assign domain to user ${userId}, user is not a Domain Manager`);
        return false;
      }
      
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
        return true;
      }
    }
    
    return false;
  };

  // Function to remove a domain from a Domain Manager
  const removeDomainFromManager = (userId: string, domainName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate) {
      // Check if user has domain manager permissions
      if (userToUpdate.role === UserRole.DomainManager) {
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
          return true;
        }
      }
    }
    
    return false;
  };

  return {
    assignDomainToAccountable,
    removeDomainFromAccountable,
    assignDomainToManager,
    removeDomainFromManager
  };
};
