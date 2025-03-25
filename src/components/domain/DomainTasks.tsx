
import React, { useState } from 'react';
import { Domain, Task } from '@/types/compliance';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

interface DomainTasksProps {
  domain: Domain;
  canManageTasks: boolean;
  onTaskCreated: (newTask: Task) => void;
  onSelectTask: (task: Task) => void;
}

const DomainTasks = ({
  domain,
  canManageTasks,
  onTaskCreated,
  onSelectTask,
}: DomainTasksProps) => {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tasks</h2>
        {canManageTasks && (
          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <TaskForm 
                onTaskCreated={onTaskCreated}
                onCancel={() => setIsTaskDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <TaskList 
        tasks={domain.tasks} 
        onSelectTask={onSelectTask}
      />
    </div>
  );
};

export default DomainTasks;
