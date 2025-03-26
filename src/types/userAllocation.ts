
// Define the allocation history entry type
export interface AllocationHistoryEntry {
  userId: string;
  domainName?: string;
  taskName?: string;
  action: 'assigned' | 'removed';
  timestamp: string;
  role: 'DomainManager' | 'DomainAccountable' | 'TaskManager';
}
