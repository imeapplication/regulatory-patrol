
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { complianceData } from '@/data/complianceData';
import { User, UserRole, getComplianceDataByDate } from '@/types/compliance';
import Navbar from '@/components/Navbar';
import TimeDisplay from '@/components/ui-components/TimeDisplay';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { Calendar as CalendarIcon, Users, History } from 'lucide-react';

interface AllocationEntry {
  user: User;
  domains: string[];
  tasks: Array<{domain: string, task: string}>;
  totalManDays: number;
}

const UserTimeline = () => {
  const { getAllUsers, getAllocationHistory } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const users = getAllUsers();
  const allocationHistory = getAllocationHistory();
  
  // Calculate user allocations based on their assigned domains and roles
  // and filter by the selected date
  const calculateAllocations = (): AllocationEntry[] => {
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
  
  // Get allocations based on selected date
  const allocations = calculateAllocations();
  
  // Get allocation events for the selected date
  const getRecentAllocationEvents = () => {
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
  
  const recentEvents = getRecentAllocationEvents();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Allocation Timeline</h1>
            <p className="text-muted-foreground mt-1">Track user assignments across domains</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <TimeDisplay />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Allocation Events */}
        {recentEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                Recent Allocation Events
              </h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {recentEvents.map((event, index) => {
                  const user = users.find(u => u.id === event.userId);
                  return (
                    <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div>
                        <span className="font-medium">{user?.name}</span>
                        <span className="text-sm text-muted-foreground ml-1">
                          was {event.action === 'assigned' ? 'assigned to' : 'removed from'} {event.domainName}
                        </span>
                        <div className="text-xs text-muted-foreground mt-1">
                          Role: {event.role}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(event.timestamp), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Allocation Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              User Allocations as of {format(selectedDate, 'MMMM d, yyyy')}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned Domains</TableHead>
                  <TableHead className="text-right">Total Man-Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations.map(allocation => (
                  <TableRow key={allocation.user.id}>
                    <TableCell className="font-medium">{allocation.user.name}</TableCell>
                    <TableCell>{allocation.user.role}</TableCell>
                    <TableCell>
                      {allocation.domains.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {allocation.domains.map(domain => (
                            <span 
                              key={domain} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {domain}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No domains assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {allocation.totalManDays > 0 ? (
                        <span className="font-medium">{allocation.totalManDays}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                
                {allocations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No user allocations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserTimeline;
