
import { useState, useEffect } from 'react';
import { isAfter, parseISO } from 'date-fns';
import { User, UserRole } from '@/types/compliance';
import { AllocationHistoryEntry } from '@/types/userAllocation';
import { complianceData } from '@/data/complianceData';

interface UserHistoryResult {
  domains: string[];
  tasks: string[];
  totalManDays: number;
  createdAt: string;
  filteredHistory: AllocationHistoryEntry[];
}

export const useUserHistory = (
  user: User | null,
  allocationHistory: AllocationHistoryEntry[],
  date: Date
): UserHistoryResult => {
  const [userAllocationHistory, setUserAllocationHistory] = useState<AllocationHistoryEntry[]>([]);
  
  // Update user allocation history when user changes
  useEffect(() => {
    if (user) {
      const history = allocationHistory.filter(entry => entry.userId === user.id);
      setUserAllocationHistory(history);
    }
  }, [user, allocationHistory]);
  
  // Calculate allocations based on history up to the current date
  const calculateAllocations = (): UserHistoryResult => {
    if (!user) return { domains: [], tasks: [], totalManDays: 0, createdAt: 'Unknown', filteredHistory: [] };
    
    // Initialize sets to track domains and tasks
    const accountableDomains = new Set<string>();
    const manageableDomains = new Set<string>();
    const manageableTasks = new Set<string>();
    
    // Process allocation history to determine current domains and tasks
    userAllocationHistory.forEach(entry => {
      const entryDate = parseISO(entry.timestamp);
      
      // Only consider entries up to the current selected date
      if (!isAfter(entryDate, date)) {
        if (entry.role === 'DomainAccountable' && entry.domainName) {
          if (entry.action === 'assigned') {
            accountableDomains.add(entry.domainName);
          } else if (entry.action === 'removed') {
            accountableDomains.delete(entry.domainName);
          }
        } else if (entry.role === 'DomainManager' && entry.domainName) {
          if (entry.action === 'assigned') {
            manageableDomains.add(entry.domainName);
          } else if (entry.action === 'removed') {
            manageableDomains.delete(entry.domainName);
          }
        } else if (entry.role === 'TaskManager' && entry.taskName) {
          if (entry.action === 'assigned') {
            manageableTasks.add(entry.taskName);
          } else if (entry.action === 'removed') {
            manageableTasks.delete(entry.taskName);
          }
        }
      }
    });
    
    // Combine domains based on user role
    let domains: string[] = [];
    let tasks: string[] = [];
    let totalManDays = 0;
    
    if (user.role === UserRole.DomainAccountable) {
      domains = [...accountableDomains];
    } else if (user.role === UserRole.DomainManager) {
      domains = [...manageableDomains];
    } else if (user.role === UserRole.TaskManager) {
      tasks = [...manageableTasks];
    }
    
    // Calculate man days
    domains.forEach(domainName => {
      const domain = complianceData.regulations.domains.find(d => d.name === domainName);
      if (domain) {
        totalManDays += domain.man_day_cost;
      }
    });
    
    // Add man days for tasks if the user is a Task Manager
    tasks.forEach(taskName => {
      // Find the task in any domain
      for (const domain of complianceData.regulations.domains) {
        const task = domain.tasks.find(t => t.name === taskName);
        if (task) {
          totalManDays += task.man_day_cost;
          break;
        }
      }
    });
    
    // Simulate creation date (would come from user data in real app)
    const createdAt = '2023-01-15T10:30:00Z';
    
    // Filter history entries by date and sort (newest first)
    const filteredHistory = userAllocationHistory
      .filter(entry => !isAfter(parseISO(entry.timestamp), date))
      .sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());
    
    return { 
      domains,
      tasks,
      totalManDays,
      createdAt,
      filteredHistory
    };
  };
  
  return calculateAllocations();
};
