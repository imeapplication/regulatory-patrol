
import React from 'react';
import { Task } from '@/types/graphqlTypes';
import GlassCard from './ui-components/GlassCard';
import Badge from './ui-components/Badge';
import { ChevronRight, Clock } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

const getStatusBadge = (status: number) => {
  switch(status) {
    case 0: return <Badge variant="outline" className="bg-gray-100">Not Started</Badge>;
    case 1: return <Badge variant="outline" className="bg-blue-100">In Progress</Badge>;
    case 2: return <Badge variant="outline" className="bg-green-100">Completed</Badge>;
    default: return <Badge variant="outline">Unknown</Badge>;
  }
};

const TaskList = ({ tasks, onSelectTask }: TaskListProps) => {
  return (
    <div className="space-y-4 animate-slide-up">
      {tasks.map((task) => (
        <GlassCard 
          key={task.id}
          className="cursor-pointer hover:bg-secondary/50 transition-all"
          onClick={() => onSelectTask(task)}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-lg">{task.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{task.description}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{task.mandays} man-days</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(task.status)}
                {task.owner && (
                  <Badge variant="outline" className="whitespace-nowrap">
                    {task.owner.firstName} {task.owner.lastName}
                  </Badge>
                )}
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
