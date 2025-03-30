
import React from 'react';
import { Domain } from '@/types/compliance';
import GlassCard from './ui-components/GlassCard';
import Badge from './ui-components/Badge';
import AnimatedCounter from './ui-components/AnimatedCounter';
import { ArrowRight } from 'lucide-react';

interface DomainCardProps {
  domain: Domain;
  onClick: () => void;
}

const DomainCard = ({ domain, onClick }: DomainCardProps) => {
  // Safely get the number of tasks
  const tasksCount = domain.tasks ? domain.tasks.length : 0;
  
  return (
    <GlassCard 
      className="h-full flex flex-col justify-between cursor-pointer transition-all transform hover:scale-[1.02]" 
      onClick={onClick}
    >
      <div>
        <Badge variant="primary" className="mb-3">
          {tasksCount} {tasksCount === 1 ? 'Task' : 'Tasks'}
        </Badge>
        <h3 className="text-xl font-semibold mb-2">{domain.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3">{domain.description || 'No description available'}</p>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <span className="text-muted-foreground text-sm">Effort:</span>
          <AnimatedCounter 
            end={domain.mandays} 
            className="font-medium" 
            suffix=" man-days"
          />
        </div>
        
        <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
      </div>
    </GlassCard>
  );
};

export default DomainCard;
