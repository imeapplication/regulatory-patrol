
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TimeDisplayProps {
  className?: string;
}

const TimeDisplay = ({ className }: TimeDisplayProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Clean up timer
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${className}`}>
      <Clock className="h-4 w-4 text-muted-foreground" />
      <span>{format(currentTime, 'h:mm:ss a')}</span>
    </div>
  );
};

export default TimeDisplay;
