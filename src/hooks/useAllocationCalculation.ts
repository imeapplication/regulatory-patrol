
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/compliance';
import { complianceData } from '@/data/complianceData';
import { isAfter, parseISO, subMonths } from 'date-fns';

interface AllocationEntry {
  user: User;
  domains: string[];
  tasks: Array<{domain: string, task: string}>;
  totalManDays: number;
}

export const useAllocationCalculation = (
  users: User[],
  allocationHistory: any[],
  selectedDate: Date,
  timeValue: number
) => {
  const [allocations, setAllocations] = useState<AllocationEntry[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  // Update date when timeValue changes
  useEffect(() => {
    // For demo purposes, let's say 0 = 3 months ago, 100 = today
    const today = new Date();
    const threeMonthsAgo = subMonths(today, 3);
    
    // Calculate the date based on the slider position
    const millisecondDiff = today.getTime() - threeMonthsAgo.getTime();
    const newDate = new Date(threeMonthsAgo.getTime() + (millisecondDiff * timeValue / 100));
    
    // This would normally update selectedDate, but we're now passing it back
    // as a return value instead of updating state here
    return newDate;
  }, [timeValue]);

  // Calculate user allocations and recent events
  useEffect(() => {
    // Calculate allocations
    const calculatedAllocations = calculateAllocations(users, allocationHistory, selectedDate);
    setAllocations(calculatedAllocations);
    
    // Get recent events
    const events = getRecentAllocationEvents(allocationHistory, selectedDate);
    setRecentEvents(events);
  }, [users, allocationHistory, selectedDate]);

  // Calculate user allocations based on their assigned domains and roles
  const calculateAllocations = (
    users: User[],
    allocationHistory: any[],
    selectedDate: Date
  ): AllocationEntry[] => {
    const allocations: AllocationEntry[] = [];
    
    users.forEach(user => {
      const userAllocation: AllocationEntry = {
        user,
        domains: [],
        tasks: [],
        totalManDays: 0
      };
      
      // Get all allocation history for this user
      const userHistory = allocationHistory.filter(entry => entry.userId === user.id);
      
      // Calculate domains based on allocation history up to the selected date
      const accountableDomains = new Set<string>();
      const manageableDomains = new Set<string>();
      
      userHistory.forEach(entry => {
        const eventDate = parseISO(entry.timestamp);
        
        // Only consider events that happened before or on the selected date
        if (!isAfter(eventDate, selectedDate)) {
          if (entry.role === 'DomainAccountable') {
            if (entry.action === 'assigned') {
              accountableDomains.add(entry.domainName);
            } else if (entry.action === 'removed') {
              accountableDomains.delete(entry.domainName);
            }
          } else if (entry.role === 'DomainManager') {
            if (entry.action === 'assigned') {
              manageableDomains.add(entry.domainName);
            } else if (entry.action === 'removed') {
              manageableDomains.delete(entry.domainName);
            }
          }
        }
      });
      
      // Add domains based on role
      if (user.role === UserRole.DomainAccountable) {
        userAllocation.domains = [...accountableDomains];
        
        // Calculate man days for accountable domains
        accountableDomains.forEach(domainName => {
          const domain = complianceData.regulations.domains.find(d => d.name === domainName);
          if (domain) {
            userAllocation.totalManDays += domain.man_day_cost;
          }
        });
      }
      
      if (user.role === UserRole.DomainManager) {
        userAllocation.domains = [...manageableDomains];
        
        // Calculate man days for manageable domains
        manageableDomains.forEach(domainName => {
          const domain = complianceData.regulations.domains.find(d => d.name === domainName);
          if (domain) {
            userAllocation.totalManDays += domain.man_day_cost;
          }
        });
      }
      
      // Only add users who have domains assigned
      if (userAllocation.domains.length > 0) {
        allocations.push(userAllocation);
      } else if (user.role === UserRole.DomainAccountable || user.role === UserRole.DomainManager) {
        // Include domain managers and accountables even if they have no domains
        allocations.push(userAllocation);
      }
    });
    
    // Sort by total man days (highest first)
    return allocations.sort((a, b) => b.totalManDays - a.totalManDays);
  };

  // Get allocation events for the selected date
  const getRecentAllocationEvents = (
    allocationHistory: any[],
    selectedDate: Date
  ): any[] => {
    // Filter events that occurred before or on the selected date
    const filteredEvents = allocationHistory.filter(event => {
      const eventDate = parseISO(event.timestamp);
      return !isAfter(eventDate, selectedDate);
    });
    
    // Sort by timestamp (newest first)
    return filteredEvents.sort((a, b) => {
      return parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime();
    }).slice(0, 10); // Get most recent 10 events
  };

  return { allocations, recentEvents };
};
