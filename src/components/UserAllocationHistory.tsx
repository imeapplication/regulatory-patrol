
import React, { useState, useEffect } from 'react';
import { parseISO, isAfter } from 'date-fns';
import { User } from '@/types/compliance';
import { useUser } from '@/contexts/UserContext';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

// Import our new components
import TimeSlider from './user-allocation/TimeSlider';
import UserAllocationHeader from './user-allocation/UserAllocationHeader';
import UserAllocationDetails from './user-allocation/UserAllocationDetails';
import AllocationHistoryList from './user-allocation/AllocationHistoryList';
import { useUserHistory } from '@/hooks/useUserHistory';

interface UserAllocationHistoryProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserAllocationHistory = ({ user, isOpen, onOpenChange }: UserAllocationHistoryProps) => {
  const { getUserAllocationHistory } = useUser();
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
  
  // Get allocation history for the user
  const allocationHistory = user ? getUserAllocationHistory(user.id) : [];
  
  // Use our custom hook to calculate allocations
  const { domains, tasks, totalManDays, createdAt, filteredHistory } = useUserHistory(
    user,
    allocationHistory,
    date
  );
  
  if (!user) return null;
  
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <UserAllocationHeader user={user} createdAt={createdAt} />
          </DrawerHeader>
          
          <div className="p-4 pb-0">
            <TimeSlider timeValue={timeValue} date={date} setTimeValue={setTimeValue} />
            
            <UserAllocationDetails 
              domains={domains} 
              tasks={tasks} 
              totalManDays={totalManDays} 
              date={date} 
            />
            
            <AllocationHistoryList historyEntries={filteredHistory} />
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
