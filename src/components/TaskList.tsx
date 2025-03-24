
import React from 'react';
import { Task } from '@/types/compliance';
import GlassCard from './ui-components/GlassCard';
import Badge from './ui-components/Badge';
import { ChevronRight, Clock } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

const TaskList = ({ tasks, onSelectTask }: TaskListProps) => {
  return (
    <div className="space-y-4 animate-slide-up">
      {tasks.map((task, index) => (
        <GlassCard 
          key={`${task.name}-${index}`}
          className="cursor-pointer hover:bg-secondary/50 transition-all"
          onClick={() => onSelectTask(task)}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-lg">{task.name}</h3>
              <p className="text-muted-foreground text-sm mt-1">{task.description}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{task.man_day_cost} man-days</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {task.roles.map((role, idx) => (
                  <Badge key={idx} variant="outline" className="whitespace-nowrap">
                    {role}
                  </Badge>
                ))}
              </div>
              
              <ChevronRight className="w-5 h-5 text-muted-foreground ml-2" />
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default TaskList;
