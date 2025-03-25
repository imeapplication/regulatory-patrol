export interface SubTask {
  name: string;
  description: string;
  man_day_cost: number;
  role: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  name: string;
  description: string;
  man_day_cost: number;
  roles: string[];
  subtasks: SubTask[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Domain {
  name: string;
  description: string;
  man_day_cost: number;
  tasks: Task[];
  accountableRole?: string;  // The role accountable for this domain
  managerRole?: string;     // The role managing this domain
  createdAt?: string;
  updatedAt?: string;
}

export interface Regulations {
  description: string;
  domains: Domain[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ComplianceData {
  regulations: Regulations;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
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

// Helper function to get current timestamp in ISO format
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Function to filter compliance data by date
export const getComplianceDataByDate = (data: ComplianceData, date: Date): ComplianceData => {
  // Clone the data to avoid modifying the original
  const clonedData = JSON.parse(JSON.stringify(data)) as ComplianceData;
  
  // Filter domains based on date
  clonedData.regulations.domains = clonedData.regulations.domains.filter(domain => {
    if (!domain.createdAt) return true;
    return new Date(domain.createdAt) <= date;
  });

  // Filter tasks for each domain
  clonedData.regulations.domains.forEach(domain => {
    domain.tasks = domain.tasks.filter(task => {
      if (!task.createdAt) return true;
      return new Date(task.createdAt) <= date;
    });

    // Filter subtasks for each task
    domain.tasks.forEach(task => {
      task.subtasks = task.subtasks.filter(subtask => {
        if (!subtask.createdAt) return true;
        return new Date(subtask.createdAt) <= date;
      });
    });
  });

  return clonedData;
};
