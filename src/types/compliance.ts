
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
}

export interface Regulations {
  description: string;
  domains: Domain[];
}

export interface ComplianceData {
  regulations: Regulations;
}
