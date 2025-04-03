
import React from 'react';
import TimeDisplay from '@/components/ui-components/TimeDisplay';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface TimelineHeaderProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setTimeValue: (value: number) => void;
}

const TimelineHeader = ({ selectedDate, setSelectedDate, setTimeValue }: TimelineHeaderProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Calculate and update the timeValue based on the selected date
      const today = new Date();
      const threeMonthsAgo = new Date(today.getTime() - (3 * 30 * 24 * 60 * 60 * 1000));
      const totalRange = today.getTime() - threeMonthsAgo.getTime();
      const datePosition = date.getTime() - threeMonthsAgo.getTime();
      const newTimeValue = Math.max(0, Math.min(100, (datePosition / totalRange) * 100));
      setTimeValue(newTimeValue);
    }
  };

  return (
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
              onSelect={handleDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TimelineHeader;
