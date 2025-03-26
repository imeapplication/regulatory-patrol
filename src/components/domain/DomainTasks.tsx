
import React, { useState } from 'react';
import { Domain, Task } from '@/types/compliance';
import { Button } from '@/components/ui/button';
import { Plus, ListChecks } from 'lucide-react';
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
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Tasks
          </h2>
        </div>
        
        {canManageTasks && (
          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1 bg-blue-600 hover:bg-blue-700 shadow-sm">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
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
      
      {domain.tasks.length === 0 && (
        <div className="text-center py-10 text-gray-500 animate-fade-in">
          <ListChecks className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-lg font-medium mb-2">No tasks yet</p>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            {canManageTasks 
              ? "Get started by adding your first task using the 'Add Task' button above."
              : "There are no tasks defined for this domain yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default DomainTasks;
