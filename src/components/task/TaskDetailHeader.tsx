
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TaskForUI } from '@/hooks/useDomainDetail';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailHeaderProps {
  task: TaskForUI;
}

const TaskDetailHeader = ({ task }: TaskDetailHeaderProps) => {
  const getStatusBadge = (status: number) => {
    switch(status) {
      case 0:
        return <Badge variant="outline" className="bg-gray-100">Not Started</Badge>;
      case 1:
        return <Badge variant="outline" className="bg-blue-100">In Progress</Badge>;
      case 2:
        return <Badge variant="outline" className="bg-green-100">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
          <p className="text-gray-600">{task.description}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(task.status)}
          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>Last updated: {formatDate(task.lastUpdated || task.startDate)}</span>
          </div>
        </div>
      </div>

      {task.owner && (
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded p-3">
          <div className="text-sm text-blue-700">
            <span className="font-medium">Current owner:</span> {task.owner.firstName} {task.owner.lastName}
            <span className="ml-2 text-xs text-gray-500">({task.owner.role})</span>
          </div>
          {task.ownerSince && (
            <div className="text-xs text-gray-500 mt-1">
              Assigned since {formatDate(task.ownerSince)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDetailHeader;
