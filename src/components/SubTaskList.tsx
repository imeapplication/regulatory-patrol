
import React from 'react';
import { SubTask } from '@/types/compliance';
import GlassCard from './ui-components/GlassCard';
import Badge from './ui-components/Badge';
import { Clock } from 'lucide-react';

interface SubTaskListProps {
  subtasks: SubTask[];
}

const SubTaskList = ({ subtasks }: SubTaskListProps) => {
  return (
    <div className="space-y-4 animate-slide-up">
      {subtasks.map((subtask, index) => (
        <GlassCard key={`${subtask.name}-${index}`}>
          <div>
            <h4 className="font-medium">{subtask.name}</h4>
            <p className="text-muted-foreground text-sm mt-1.5">{subtask.description}</p>
            
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{subtask.man_day_cost} man-days</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {subtask.role.map((role, idx) => (
                  <Badge key={idx} variant="primary" className="whitespace-nowrap">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default SubTaskList;
