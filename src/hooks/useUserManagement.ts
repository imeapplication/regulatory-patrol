
import { useState, useEffect } from 'react';
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

export const useUserManagement = () => {
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

  // Sync users with localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

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

  return {
    users,
    currentUser,
    isAuthenticated,
    isAdmin: currentUser?.role === UserRole.Administrator,
    login,
    logout,
    getAllUsers,
    addUser,
    updateUser,
    deleteUser
  };
};
