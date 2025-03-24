
import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter = ({ 
  end, 
  duration = 1000, 
  className = "", 
  prefix = "", 
  suffix = "" 
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}{count}{suffix}
    </span>
  );
};

export default AnimatedCounter;
