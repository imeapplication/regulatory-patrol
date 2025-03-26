import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, getRolePermissions } from '@/types/compliance';
import { complianceData } from '@/data/complianceData';

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
  }
];

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
  isDomainAccountableFor: (domainName: string) => boolean;
  saveComplianceData: () => void;
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

  // Load saved compliance data from localStorage on initial render ONLY
  useEffect(() => {
    const savedComplianceData = localStorage.getItem('complianceData');
    if (savedComplianceData) {
      try {
        const parsedData = JSON.parse(savedComplianceData);
        // Update the imported complianceData with the saved data
        Object.assign(complianceData, parsedData);
        console.log("Loaded compliance data from localStorage:", parsedData);
      } catch (error) {
        console.error("Error loading saved compliance data:", error);
      }
    } else {
      console.log("No saved compliance data found in localStorage");
    }
  }, []);

  // Sync users with localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
    console.log("Saved users to localStorage:", users);
  }, [users]);

  const saveComplianceData = () => {
    try {
      localStorage.setItem('complianceData', JSON.stringify(complianceData));
      console.log("Saved compliance data to localStorage:", complianceData);
    } catch (error) {
      console.error("Error saving compliance data:", error);
    }
  };

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
  };

  const updateUser = (updatedUser: User) => {
    const newUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(newUsers);
    
    // If the current user was updated, update the currentUser state
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (userId: string) => {
    const newUsers = users.filter(user => user.id !== userId);
    setUsers(newUsers);
  };

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
      }
    }
  };

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
      isDomainAccountableFor,
      saveComplianceData
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
