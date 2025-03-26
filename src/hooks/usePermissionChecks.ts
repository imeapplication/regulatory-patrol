
import { User, UserRole } from '@/types/compliance';

interface PermissionChecksProps {
  currentUser: User | null;
}

export const usePermissionChecks = ({ currentUser }: PermissionChecksProps) => {
  const isDomainAccountableFor = (domainName: string): boolean => {
    if (!currentUser || currentUser.role !== UserRole.DomainAccountable) {
      return false;
    }
    
    const accountableDomains = currentUser.permissions.accountableDomains || [];
    return accountableDomains.includes(domainName);
  };

  // Function to check if current user is manager for a domain
  const isDomainManagerFor = (domainName: string): boolean => {
    if (!currentUser || currentUser.role !== UserRole.DomainManager) {
      return false;
    }
    
    const manageableDomains = currentUser.permissions.manageableDomains || [];
    return manageableDomains.includes(domainName);
  };

  // Function to check if current user is manager for a task
  const isTaskManagerFor = (taskName: string): boolean => {
    if (!currentUser || currentUser.role !== UserRole.TaskManager) {
      return false;
    }
    
    const manageableTasks = currentUser.permissions.manageableTasks || [];
    return manageableTasks.includes(taskName);
  };

  return {
    isDomainAccountableFor,
    isDomainManagerFor,
    isTaskManagerFor
  };
};
