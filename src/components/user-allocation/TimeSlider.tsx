
import React from 'react';
import { format } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import { Clock } from 'lucide-react';

interface TimeSliderProps {
  timeValue: number;
  date: Date;
  setTimeValue: (value: number) => void;
}

const TimeSlider = ({ timeValue, date, setTimeValue }: TimeSliderProps) => {
  return (
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
  );
};

export default TimeSlider;
