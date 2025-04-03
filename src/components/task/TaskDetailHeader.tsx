
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TaskForUI } from '@/hooks/useDomainDetail';

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

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
        <p className="text-gray-600">{task.description}</p>
      </div>
      <div>
        {getStatusBadge(task.status)}
      </div>
    </div>
  );
};

export default TaskDetailHeader;
