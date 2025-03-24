
export interface SubTask {
  name: string;
  description: string;
  man_day_cost: number;
  role: string[];
}

export interface Task {
  name: string;
  description: string;
  man_day_cost: number;
  roles: string[];
  subtasks: SubTask[];
}

export interface Domain {
  name: string;
  description: string;
  man_day_cost: number;
  tasks: Task[];
  accountableRole?: string;  // The role accountable for this domain
  managerRole?: string;     // The role managing this domain
}

export interface Regulations {
  description: string;
  domains: Domain[];
}

export interface ComplianceData {
  regulations: Regulations;
}

// User role types
export enum UserRole {
  Administrator = "Administrator",
  DomainAccountable = "Domain Accountable",
  DomainManager = "Domain Manager",
  Regular = "Regular"
}

export interface UserPermissions {
  canAddItems: boolean;
  canModifyItems: boolean;
  canDeleteItems: boolean;
  canAssignRoles: boolean;
  canViewReports: boolean;
  manageableDomains?: string[]; // For Domain Managers
  accountableDomains?: string[]; // For Domain Accountables
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: UserPermissions;
}

// Define default permissions by role
export const getRolePermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case UserRole.Administrator:
      return {
        canAddItems: true,
        canModifyItems: true,
        canDeleteItems: true,
        canAssignRoles: true,
        canViewReports: true
      };
    case UserRole.DomainAccountable:
      return {
        canAddItems: false,
        canModifyItems: true,
        canDeleteItems: false,
        canAssignRoles: false,
        canViewReports: true,
        accountableDomains: []
      };
    case UserRole.DomainManager:
      return {
        canAddItems: true,
        canModifyItems: true,
        canDeleteItems: true,
        canAssignRoles: false,
        canViewReports: true,
        manageableDomains: []
      };
    case UserRole.Regular:
      return {
        canAddItems: false,
        canModifyItems: false,
        canDeleteItems: false,
        canAssignRoles: false,
        canViewReports: true
      };
  }
};
