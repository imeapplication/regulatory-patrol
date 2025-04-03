
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
  const { getAllUsers } = useUser();
  const { addAllocationHistoryEntry } = useAllocationHistory();
  const [currentOwnerId, setCurrentOwnerId] = useState<string | undefined>(task.owner?.id);
  
  // Get all users and filter to only show Task Managers
  const users = getAllUsers();
  const taskManagers = users.filter(user => user.role === UserRole.TaskManager);
  
  // Update the current owner ID whenever task.owner changes
  useEffect(() => {
    setCurrentOwnerId(task.owner?.id);
  }, [task.owner?.id]);

  // Handle owner change with history tracking
  const handleSelectChange = (userId: string) => {
    if (userId === currentOwnerId) return;
    
    onOwnerChange(userId);
    
    // Add to allocation history
    if (domainTitle) {
      addAllocationHistoryEntry({
        userId,
        domainName: domainTitle,
        taskName: task.title,
        action: 'assigned',
        timestamp: new Date().toISOString(),
        role: 'TaskManager'
      });
    }
    
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
