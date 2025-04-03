
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskNotFoundProps {
  onBack: () => void;
}

const TaskNotFound = ({ onBack }: TaskNotFoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-xl font-medium mb-2">Task Not Found</h2>
      <p className="text-muted-foreground mb-4">We couldn't find the task you're looking for.</p>
      <Button onClick={onBack}>Back to Domain</Button>
    </div>
  );
};

export default TaskNotFound;
