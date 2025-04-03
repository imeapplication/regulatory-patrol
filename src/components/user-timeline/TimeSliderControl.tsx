
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { format, subMonths } from 'date-fns';
import { Clock } from 'lucide-react';

interface TimeSliderControlProps {
  timeValue: number;
  setTimeValue: (value: number) => void;
  selectedDate: Date;
}

const TimeSliderControl = ({ timeValue, setTimeValue, selectedDate }: TimeSliderControlProps) => {
  // Calculate the date from 3 months ago for display
  const threeMonthsAgo = subMonths(new Date(), 3);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
      <div className="text-lg font-medium flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <span>Time Machine</span>
      </div>
      
      <div className="space-y-4">
        <Slider
          value={[timeValue]}
          onValueChange={(value) => setTimeValue(value[0])}
          min={0}
          max={100}
          step={1}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{format(threeMonthsAgo, 'MMM d, yyyy')}</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-medium">{format(selectedDate, 'MMM d, yyyy')}</span>
          </div>
          <span className="text-xs text-muted-foreground">Today</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSliderControl;
