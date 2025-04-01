
import { useState, useEffect } from 'react';
import { BusinessRole } from '@/types/compliance';

// Initial business roles - matches the enum
const DEFAULT_BUSINESS_ROLES = Object.values(BusinessRole)
  .filter(role => role !== BusinessRole.None)
  .map(role => ({
    id: role,
    name: role,
    description: `Default description for ${role}`,
  }));

interface BusinessRoleEntry {
  id: string;
  name: string;
  description: string;
}

export const useBusinessRoleManagement = () => {
  const [businessRoles, setBusinessRoles] = useState<BusinessRoleEntry[]>(() => {
    // Initialize roles from localStorage if available
    const savedRoles = localStorage.getItem('businessRoles');
    return savedRoles ? JSON.parse(savedRoles) : DEFAULT_BUSINESS_ROLES;
  });
  
  // Sync roles with localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('businessRoles', JSON.stringify(businessRoles));
  }, [businessRoles]);
  
  const getAllBusinessRoles = (): BusinessRoleEntry[] => {
    return businessRoles;
  };
  
  const addBusinessRole = (role: BusinessRoleEntry) => {
    const newRoles = [...businessRoles, role];
    setBusinessRoles(newRoles);
    localStorage.setItem('businessRoles', JSON.stringify(newRoles));
  };
  
  const updateBusinessRole = (updatedRole: BusinessRoleEntry) => {
    const newRoles = businessRoles.map(role => 
      role.id === updatedRole.id ? updatedRole : role
    );
    setBusinessRoles(newRoles);
    localStorage.setItem('businessRoles', JSON.stringify(newRoles));
  };
  
  const deleteBusinessRole = (roleId: string) => {
    const newRoles = businessRoles.filter(role => role.id !== roleId);
    setBusinessRoles(newRoles);
    localStorage.setItem('businessRoles', JSON.stringify(newRoles));
  };
  
  return {
    businessRoles,
    getAllBusinessRoles,
    addBusinessRole,
    updateBusinessRole,
    deleteBusinessRole
  };
};

export type { BusinessRoleEntry };
