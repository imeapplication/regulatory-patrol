
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  className?: string;
}

const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors animate-fade-in",
        variant === 'default' && "bg-gray-100 text-gray-800",
        variant === 'primary' && "bg-primary/10 text-primary",
        variant === 'secondary' && "bg-secondary text-secondary-foreground",
        variant === 'outline' && "border border-border bg-transparent",
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
