
import React, { createContext, useContext } from 'react';
import { User } from '@/types/compliance';
import { AllocationHistoryEntry } from '@/types/userAllocation';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useAllocationHistory } from '@/hooks/useAllocationHistory';
import { useDomainManagement } from '@/hooks/useDomainManagement';
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { usePermissionChecks } from '@/hooks/usePermissionChecks';

interface UserContextType {
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  getAllUsers: () => User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  assignDomainToAccountable: (userId: string, domainName: string) => void;
  removeDomainFromAccountable: (userId: string, domainName: string) => void;
  assignDomainToManager: (userId: string, domainName: string) => void;
  removeDomainFromManager: (userId: string, domainName: string) => void;
  assignTaskToManager: (userId: string, domainName: string, taskName: string) => void;
  removeTaskFromManager: (userId: string, taskName: string) => void;
  isDomainAccountableFor: (domainName: string) => boolean;
  isDomainManagerFor: (domainName: string) => boolean;
  isTaskManagerFor: (taskName: string) => boolean;
  getAllocationHistory: () => AllocationHistoryEntry[];
  getUserAllocationHistory: (userId: string) => AllocationHistoryEntry[];
  getTaskManagerUsers: () => User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    users,
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    getAllUsers,
    addUser,
    updateUser,
    deleteUser
  } = useUserManagement();
  
  const {
    allocationHistory,
    getAllocationHistory,
    getUserAllocationHistory,
    addAllocationHistoryEntry
  } = useAllocationHistory();
  
  const {
    assignDomainToAccountable,
    removeDomainFromAccountable,
    assignDomainToManager,
    removeDomainFromManager
  } = useDomainManagement({
    users,
    updateUser,
    addAllocationHistoryEntry
  });
  
  const {
    assignTaskToManager,
    removeTaskFromManager,
    getTaskManagerUsers
  } = useTaskManagement({
    users,
    updateUser,
    addAllocationHistoryEntry
  });
  
  const {
    isDomainAccountableFor,
    isDomainManagerFor,
    isTaskManagerFor
  } = usePermissionChecks({
    currentUser
  });

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      isAuthenticated, 
      isAdmin,
      getAllUsers,
      addUser,
      updateUser,
      deleteUser,
      assignDomainToAccountable,
      removeDomainFromAccountable,
      assignDomainToManager,
      removeDomainFromManager,
      assignTaskToManager,
      removeTaskFromManager,
      isDomainAccountableFor,
      isDomainManagerFor,
      isTaskManagerFor,
      getAllocationHistory,
      getUserAllocationHistory,
      getTaskManagerUsers
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
