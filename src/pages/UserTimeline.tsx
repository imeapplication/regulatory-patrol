
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { subMonths } from 'date-fns';
import Navbar from '@/components/Navbar';
import TimelineHeader from '@/components/user-timeline/TimelineHeader';
import TimeSliderControl from '@/components/user-timeline/TimeSliderControl';
import RecentEventsSection from '@/components/user-timeline/RecentEventsSection';
import AllocationTable from '@/components/user-timeline/AllocationTable';
import { useAllocationCalculation } from '@/hooks/useAllocationCalculation';

const UserTimeline = () => {
  const { getAllUsers, getAllocationHistory } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeValue, setTimeValue] = useState(100); // 0-100 representing past to present
  const users = getAllUsers();
  const allocationHistory = getAllocationHistory();
  
  // Update date when timeValue changes
  useEffect(() => {
    // For demo purposes, let's say 0 = 3 months ago, 100 = today
    const today = new Date();
    const threeMonthsAgo = subMonths(today, 3);
    
    // Calculate the date based on the slider position
    const millisecondDiff = today.getTime() - threeMonthsAgo.getTime();
    const newDate = new Date(threeMonthsAgo.getTime() + (millisecondDiff * timeValue / 100));
    setSelectedDate(newDate);
  }, [timeValue]);
  
  // Use the new hook to calculate allocations and get recent events
  const { allocations, recentEvents } = useAllocationCalculation(
    users, 
    allocationHistory,
    selectedDate,
    timeValue
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header component */}
        <TimelineHeader 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate}
          setTimeValue={setTimeValue}
        />
        
        {/* Time Slider component */}
        <TimeSliderControl
          timeValue={timeValue}
          setTimeValue={setTimeValue}
          selectedDate={selectedDate}
        />
        
        {/* Recent Events component */}
        <RecentEventsSection 
          recentEvents={recentEvents} 
          users={users}
        />
        
        {/* Allocation Table component */}
        <AllocationTable 
          allocations={allocations}
          selectedDate={selectedDate}
        />
      </main>
    </div>
  );
};

export default UserTimeline;
