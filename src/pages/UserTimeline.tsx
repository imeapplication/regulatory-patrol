
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { complianceData } from '@/data/complianceData';
import { User, UserRole, Domain, Task } from '@/types/compliance';
import Navbar from '@/components/Navbar';
import TimeDisplay from '@/components/ui-components/TimeDisplay';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users } from 'lucide-react';

interface AllocationEntry {
  user: User;
  domains: string[];
  tasks: Array<{domain: string, task: string}>;
  totalManDays: number;
}

const UserTimeline = () => {
  const { getAllUsers } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const users = getAllUsers();
  
  // Calculate user allocations based on their assigned domains and roles
  const calculateAllocations = (): AllocationEntry[] => {
    const allocations: AllocationEntry[] = [];
    
    users.forEach(user => {
      const userAllocation: AllocationEntry = {
        user,
        domains: [],
        tasks: [],
        totalManDays: 0
      };
      
      // If user is Domain Accountable, add their accountable domains
      if (user.role === UserRole.DomainAccountable && user.permissions.accountableDomains) {
        userAllocation.domains = [...user.permissions.accountableDomains];
        
        // Calculate man days for accountable domains
        user.permissions.accountableDomains.forEach(domainName => {
          const domain = complianceData.regulations.domains.find(d => d.name === domainName);
          if (domain) {
            userAllocation.totalManDays += domain.man_day_cost;
          }
        });
      }
      
      // If user is Domain Manager, add their manageable domains
      if (user.role === UserRole.DomainManager && user.permissions.manageableDomains) {
        userAllocation.domains = [...(user.permissions.manageableDomains || [])];
        
        // Calculate man days for manageable domains
        user.permissions.manageableDomains.forEach(domainName => {
          const domain = complianceData.regulations.domains.find(d => d.name === domainName);
          if (domain) {
            userAllocation.totalManDays += domain.man_day_cost;
          }
        });
      }
      
      // Remove duplicates from domains
      userAllocation.domains = [...new Set(userAllocation.domains)];
      
      allocations.push(userAllocation);
    });
    
    // Sort by total man days (highest first)
    return allocations.sort((a, b) => b.totalManDays - a.totalManDays);
  };
  
  const allocations = calculateAllocations();
  
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
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
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
