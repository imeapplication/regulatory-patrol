
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { TaskForUI } from '@/hooks/useDomainDetail';

interface TaskActionsProps {
  task: TaskForUI;
  onBack: () => void;
}

const TaskActions = ({ task, onBack }: TaskActionsProps) => {
  return (
    <div className="space-y-3">
      <div className="p-3 border rounded-md flex items-center justify-between">
        <div>
          <div className="font-medium">Update task status</div>
        </div>
        <Button variant="outline" size="sm">
          <Check className="w-4 h-4 mr-2" /> Mark as In Progress
        </Button>
      </div>
      <div className="p-3 border rounded-md flex items-center justify-between">
        <div>
          <div className="font-medium">View related documents</div>
        </div>
        <Button variant="outline" size="sm" disabled={!task.documentLink}>
          {task.documentLink ? "Open Document" : "No Document"}
        </Button>
      </div>
      <div className="p-3 border rounded-md flex items-center justify-between">
        <div>
          <div className="font-medium">Return to domain</div>
        </div>
        <Button variant="outline" size="sm" onClick={onBack}>
          Back to Domain
        </Button>
      </div>
    </div>
  );
};

export default TaskActions;
