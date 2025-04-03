
import React, { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/types/compliance';
import { useAllocationHistory } from '@/hooks/useAllocationHistory';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskForUI } from '@/hooks/useDomainDetail';
import { useTaskManagement } from '@/hooks/useTaskManagement';

interface TaskOwnerSelectProps {
  task: TaskForUI;
  domainTitle: string;
  onOwnerChange: (userId: string) => void;
}

const TaskOwnerSelect = ({ task, domainTitle, onOwnerChange }: TaskOwnerSelectProps) => {
  const { getAllUsers, updateUser } = useUser();
  const { addAllocationHistoryEntry } = useAllocationHistory();
  const [currentOwnerId, setCurrentOwnerId] = useState<string | undefined>(task.owner?.id);
  
  // Initialize task management hooks
  const { getTaskManagerUsers } = useTaskManagement({
    users: getAllUsers(),
    updateUser,
    addAllocationHistoryEntry
  });
  
  // Get all users and filter to only show Task Managers
  const users = getAllUsers();
  const taskManagers = users.filter(user => user.role === UserRole.TaskManager);
  
  // Check if the task is in user's permissions
  useEffect(() => {
    if (task.owner?.id) {
      // Set current owner ID from task
      setCurrentOwnerId(task.owner.id);
      
      // Also verify if this task is in the user's permissions
      const ownerUser = users.find(user => user.id === task.owner?.id);
      if (ownerUser && ownerUser.role === UserRole.TaskManager) {
        // If the owner exists but doesn't have this task in permissions, sync it
        const manageableTasks = ownerUser.permissions.manageableTasks || [];
        if (!manageableTasks.includes(task.title)) {
          // Add the task to the user's permissions
          const updatedUser = {
            ...ownerUser,
            permissions: {
              ...ownerUser.permissions,
              manageableTasks: [...manageableTasks, task.title]
            }
          };
          
          updateUser(updatedUser);
          
          // Log allocation history
          addAllocationHistoryEntry({
            userId: ownerUser.id,
            domainName: domainTitle,
            taskName: task.title,
            action: 'assigned',
            timestamp: new Date().toISOString(),
            role: 'TaskManager'
          });
        }
      }
    } else {
      setCurrentOwnerId('');
      
      // Check if this task is assigned to any task manager in permissions
      const taskManagers = users.filter(user => user.role === UserRole.TaskManager);
      for (const manager of taskManagers) {
        const manageableTasks = manager.permissions.manageableTasks || [];
        if (manageableTasks.includes(task.title)) {
          // Found a task manager with this task - update the task UI
          onOwnerChange(manager.id);
          break;
        }
      }
    }
  }, [task, users, domainTitle, updateUser, addAllocationHistoryEntry, onOwnerChange]);

  // Handle owner change with history tracking
  const handleSelectChange = (userId: string) => {
    if (userId === currentOwnerId) return;
    
    onOwnerChange(userId);
    setCurrentOwnerId(userId);
  };

  // Find the current owner to display properly
  const currentOwner = taskManagers.find(user => user.id === currentOwnerId);

  return (
    <Select 
      value={currentOwnerId} 
      onValueChange={handleSelectChange}
    >
      <SelectTrigger className="bg-transparent border-none shadow-none p-0 h-auto">
        <SelectValue placeholder="Assign an owner">
          {currentOwner ? currentOwner.name : "Unassigned"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white z-50 shadow-md">
        {taskManagers.length > 0 ? (
          taskManagers.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name} {user.businessRole && `(${user.businessRole})`}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="none" disabled>No Task Managers available</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default TaskOwnerSelect;
