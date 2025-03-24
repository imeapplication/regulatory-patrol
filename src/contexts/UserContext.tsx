
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On component mount, check for saved user in localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }

    // Load saved users from localStorage if they exist
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize localStorage with default users
      localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
    }
  }, []);

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
      deleteUser 
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
