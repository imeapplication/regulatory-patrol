
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard = ({ children, className, hoverEffect = true, ...props }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300 animate-scale-in",
        hoverEffect && "hover:shadow-md hover:translate-y-[-2px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
