
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, getRolePermissions } from '@/types/compliance';

// Sample user data
const DEFAULT_USERS = [
  {
    id: "1",
    name: "CLA",
    email: "cla@example.com",
    role: UserRole.Administrator,
    permissions: getRolePermissions(UserRole.Administrator)
  },
  {
    id: "2",
    name: "Domain Manager",
    email: "manager@example.com",
    role: UserRole.DomainManager,
    permissions: getRolePermissions(UserRole.DomainManager)
  },
  {
    id: "3",
    name: "Domain Accountable",
    email: "accountable@example.com",
    role: UserRole.DomainAccountable,
    permissions: {
      ...getRolePermissions(UserRole.DomainAccountable),
      accountableDomains: []
    }
  },
  {
    id: "4",
    name: "Task Manager",
    email: "taskmanager@example.com",
    role: UserRole.TaskManager,
    permissions: {
      ...getRolePermissions(UserRole.TaskManager),
      manageableTasks: []
    }
  }
];

// Define the allocation history entry type
interface AllocationHistoryEntry {
  userId: string;
  domainName?: string;
  taskName?: string;
  action: 'assigned' | 'removed';
  timestamp: string;
  role: 'DomainManager' | 'DomainAccountable' | 'TaskManager';
}

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
  const [users, setUsers] = useState<User[]>(() => {
    // Initialize users from localStorage if available
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : DEFAULT_USERS;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Initialize currentUser from localStorage if available
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize authentication state based on currentUser
    return localStorage.getItem('currentUser') !== null;
  });

  // Add state for allocation history
  const [allocationHistory, setAllocationHistory] = useState<AllocationHistoryEntry[]>(() => {
    const savedHistory = localStorage.getItem('allocationHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Sync users with localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Sync allocation history with localStorage
  useEffect(() => {
    localStorage.setItem('allocationHistory', JSON.stringify(allocationHistory));
  }, [allocationHistory]);

  const login = (email: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const getAllUsers = (): User[] => {
    return users;
  };

  const addUser = (user: User) => {
    const newUsers = [...users, user];
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  const updateUser = (updatedUser: User) => {
    const newUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
    
    // If the current user was updated, update the currentUser state
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (userId: string) => {
    const newUsers = users.filter(user => user.id !== userId);
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  // Updated to add history entry
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
        
        setAllocationHistory(prev => [...prev, historyEntry]);
      }
    }
  };

  // Updated to add history entry
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
        
        setAllocationHistory(prev => [...prev, historyEntry]);
      }
    }
  };

  // Add function to assign domain to manager
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
        
        setAllocationHistory(prev => [...prev, historyEntry]);
      }
    }
  };

  // Add function to remove domain from manager
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
        
        setAllocationHistory(prev => [...prev, historyEntry]);
      }
    }
  };

  // Function to assign a task to a Task Manager
  const assignTaskToManager = (userId: string, domainName: string, taskName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate && userToUpdate.role === UserRole.TaskManager) {
      const manageableTasks = userToUpdate.permissions.manageableTasks || [];
      
      // Only add if not already assigned
      if (!manageableTasks.includes(taskName)) {
        const updatedUser = {
          ...userToUpdate,
          permissions: {
            ...userToUpdate.permissions,
            manageableTasks: [...manageableTasks, taskName]
          }
        };
        
        updateUser(updatedUser);
        
        // Add history entry
        const historyEntry: AllocationHistoryEntry = {
          userId,
          domainName,
          taskName,
          action: 'assigned',
          timestamp: new Date().toISOString(),
          role: 'TaskManager'
        };
        
        setAllocationHistory(prev => [...prev, historyEntry]);
      }
    }
  };

  // Function to remove a task from a Task Manager
  const removeTaskFromManager = (userId: string, taskName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate && userToUpdate.role === UserRole.TaskManager) {
      const manageableTasks = userToUpdate.permissions.manageableTasks || [];
      
      if (manageableTasks.includes(taskName)) {
        const updatedUser = {
          ...userToUpdate,
          permissions: {
            ...userToUpdate.permissions,
            manageableTasks: manageableTasks.filter(task => task !== taskName)
          }
        };
        
        updateUser(updatedUser);
        
        // Add history entry
        const historyEntry: AllocationHistoryEntry = {
          userId,
          taskName,
          action: 'removed',
          timestamp: new Date().toISOString(),
          role: 'TaskManager'
        };
        
        setAllocationHistory(prev => [...prev, historyEntry]);
      }
    }
  };

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

  // Functions to access allocation history
  const getAllocationHistory = (): AllocationHistoryEntry[] => {
    return allocationHistory;
  };

  const getUserAllocationHistory = (userId: string): AllocationHistoryEntry[] => {
    return allocationHistory.filter(entry => entry.userId === userId);
  };

  // Function to get all Task Manager users
  const getTaskManagerUsers = (): User[] => {
    return users.filter(user => user.role === UserRole.TaskManager);
  };

  const isAdmin = currentUser?.role === UserRole.Administrator;

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
