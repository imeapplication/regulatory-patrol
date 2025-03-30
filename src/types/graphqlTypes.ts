
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  domains?: Domain[];
}

export interface Domain {
  id: string;
  title: string;
  description?: string;
  documentLink?: string;
  responsible?: User;
  startDate: string;
  endDate: string;
  mandays: number;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  documentLink?: string;
  startDate: string;
  endDate: string;
  mandays: number;
  status: number;
  owner?: User;
  subtasks?: Task[];
  actions?: Action[];
}

export interface Action {
  id: string;
  title: string;
  description?: string;
  status: number;
  startDate: string;
  endDate?: string;
  discussion?: Comment[];
}

export interface Comment {
  id: string;
  user: User;
  date: string;
  text: string;
  documentLink?: string;
}
