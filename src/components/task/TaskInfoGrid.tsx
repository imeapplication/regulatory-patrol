
import React from 'react';
import { Clock, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { TaskForUI } from '@/hooks/useDomainDetail';
import TaskOwnerSelect from '@/components/TaskOwnerSelect';

interface TaskInfoGridProps {
  task: TaskForUI;
  domainTitle: string;
  onOwnerChange: (userId: string) => void;
}

const TaskInfoGrid = ({ task, domainTitle, onOwnerChange }: TaskInfoGridProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <Clock className="w-5 h-5 text-gray-500" />
        <div>
          <div className="text-sm text-gray-500">Effort</div>
          <div className="font-medium">{task.mandays} man-days</div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <Calendar className="w-5 h-5 text-gray-500" />
        <div>
          <div className="text-sm text-gray-500">Timeline</div>
          <div className="font-medium">
            {formatDate(task.startDate)} - {formatDate(task.endDate)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <Users className="w-5 h-5 text-gray-500" />
        <div>
          <div className="text-sm text-gray-500">Owner</div>
          <TaskOwnerSelect 
            task={task} 
            domainTitle={domainTitle} 
            onOwnerChange={onOwnerChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskInfoGrid;
