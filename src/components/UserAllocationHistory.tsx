
import React, { useState, useEffect } from 'react';
import { format, parseISO, isAfter } from 'date-fns';
import { User, UserRole } from '@/types/compliance';
import { complianceData } from '@/data/complianceData';
import { Clock, CalendarIcon } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import Badge from '@/components/ui-components/Badge';
import { useUser } from '@/contexts/UserContext';

interface UserAllocationHistoryProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserAllocationHistory = ({ user, isOpen, onOpenChange }: UserAllocationHistoryProps) => {
  const { getUserAllocationHistory } = useUser();
  const [timeValue, setTimeValue] = useState(100); // 0-100 representing past to present
  const [date, setDate] = useState<Date>(new Date());
  const [allocationHistory, setAllocationHistory] = useState<Array<{
    domainName: string;
    action: string;
    timestamp: string;
    role: string;
  }>>([]);
  
  // Update date when timeValue changes
  useEffect(() => {
    // For demo purposes, let's say 0 = 3 months ago, 100 = today
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    // Calculate the date based on the slider position
    const millisecondDiff = today.getTime() - threeMonthsAgo.getTime();
    const newDate = new Date(threeMonthsAgo.getTime() + (millisecondDiff * timeValue / 100));
    setDate(newDate);
  }, [timeValue]);
  
  // Fetch user allocation history when user changes
  useEffect(() => {
    if (user) {
      const history = getUserAllocationHistory(user.id);
      setAllocationHistory(history);
    }
  }, [user, getUserAllocationHistory]);
  
  // Calculate user allocations based on allocation history up to the current date
  const calculateAllocations = () => {
    if (!user) return { domains: [], totalManDays: 0, createdAt: 'Unknown' };
    
    // Initialize sets to track domains
    const accountableDomains = new Set<string>();
    const manageableDomains = new Set<string>();
    
    // Process allocation history to determine current domains
    allocationHistory.forEach(entry => {
      const entryDate = parseISO(entry.timestamp);
      
      // Only consider entries up to the current selected date
      if (!isAfter(entryDate, date)) {
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
    
    // Combine domains based on user role
    let domains: string[] = [];
    let totalManDays = 0;
    
    if (user.role === UserRole.DomainAccountable) {
      domains = [...accountableDomains];
    } else if (user.role === UserRole.DomainManager) {
      domains = [...manageableDomains];
    }
    
    // Calculate man days
    domains.forEach(domainName => {
      const domain = complianceData.regulations.domains.find(d => d.name === domainName);
      if (domain) {
        totalManDays += domain.man_day_cost;
      }
    });
    
    // Simulate creation date (would come from user data in real app)
    const createdAt = '2023-01-15T10:30:00Z';
    
    return { 
      domains,
      totalManDays,
      createdAt
    };
  };
  
  const { domains, totalManDays, createdAt } = calculateAllocations();
  
  // Filter history entries by date
  const filteredHistory = allocationHistory.filter(entry => {
    const entryDate = parseISO(entry.timestamp);
    return !isAfter(entryDate, date);
  });
  
  // Sort history by timestamp (newest first)
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    return parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime();
  });
  
  if (!user) return null;
  
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center text-xl font-bold">{user.name}</DrawerTitle>
            <DrawerDescription className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>{user.email}</span>
                <span>•</span>
                <span className="capitalize">{user.role}</span>
              </div>
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4 pb-0">
            <div className="mb-6">
              <div className="text-sm font-medium text-muted-foreground mb-2">Account Created</div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(createdAt), 'PPP')}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="text-sm font-medium text-muted-foreground mb-2">Time Machine</div>
              <div className="space-y-4">
                <Slider
                  value={[timeValue]}
                  onValueChange={(value) => setTimeValue(value[0])}
                  min={0}
                  max={100}
                  step={1}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">3 months ago</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-medium">{format(date, 'MMM d, yyyy')}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-sm font-medium flex items-center gap-2 mb-2">
                <span>Allocation as of {format(date, 'MMM d, yyyy')}</span>
                <Badge variant="outline" className="text-xs">
                  {totalManDays} man-days
                </Badge>
              </div>
              
              {domains.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {domains.map(domain => (
                    <Badge key={domain} variant="secondary" className="text-xs">
                      {domain}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic mt-2">
                  No domains assigned at this time
                </div>
              )}
            </div>
            
            {/* Allocation History */}
            <div className="mb-6">
              <div className="text-sm font-medium mb-3">Allocation History</div>
              
              {sortedHistory.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-2">
                  {sortedHistory.map((entry, index) => (
                    <div key={index} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm font-medium">
                            {entry.action === 'assigned' ? 'Assigned to' : 'Removed from'} {entry.domainName}
                          </span>
                          <div className="text-xs text-muted-foreground mt-1">
                            Role: {entry.role}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(parseISO(entry.timestamp), 'MMM d, yyyy h:mm a')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic mt-2">
                  No allocation history available
                </div>
              )}
            </div>
          </div>
          
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default UserAllocationHistory;
