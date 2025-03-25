
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { User, UserRole, Domain } from '@/types/compliance';
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
import { Badge } from '@/components/ui-components/Badge';

interface UserAllocationHistoryProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserAllocationHistory = ({ user, isOpen, onOpenChange }: UserAllocationHistoryProps) => {
  const [timeValue, setTimeValue] = useState(100); // 0-100 representing past to present
  const [date, setDate] = useState<Date>(new Date());
  
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
  
  // Calculate user allocations
  const calculateAllocations = () => {
    if (!user) return { domains: [], totalManDays: 0, createdAt: 'Unknown' };
    
    const domains: string[] = [];
    let totalManDays = 0;
    
    // Fetch domains based on user role
    if (user.role === UserRole.DomainAccountable && user.permissions.accountableDomains) {
      domains.push(...user.permissions.accountableDomains);
      
      // Calculate man days for accountable domains
      user.permissions.accountableDomains.forEach(domainName => {
        const domain = complianceData.regulations.domains.find(d => d.name === domainName);
        if (domain) {
          totalManDays += domain.man_day_cost;
        }
      });
    }
    
    if (user.role === UserRole.DomainManager && user.permissions.manageableDomains) {
      domains.push(...user.permissions.manageableDomains);
      
      // Calculate man days for manageable domains
      user.permissions.manageableDomains.forEach(domainName => {
        const domain = complianceData.regulations.domains.find(d => d.name === domainName);
        if (domain) {
          totalManDays += domain.man_day_cost;
        }
      });
    }
    
    // Simulate creation date (would come from user data in real app)
    const createdAt = '2023-01-15T10:30:00Z';
    
    return { 
      domains: [...new Set(domains)], // Remove duplicates
      totalManDays,
      createdAt
    };
  };
  
  const { domains, totalManDays, createdAt } = calculateAllocations();
  
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
