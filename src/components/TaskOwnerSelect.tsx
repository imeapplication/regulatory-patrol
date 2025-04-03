
import React from 'react';
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
import { User } from '@/types/graphqlTypes';
import { TaskForUI } from '@/hooks/useDomainDetail';

interface TaskOwnerSelectProps {
  task: TaskForUI;
  domainTitle: string;
  onOwnerChange: (userId: string) => void;
}

const TaskOwnerSelect = ({ task, domainTitle, onOwnerChange }: TaskOwnerSelectProps) => {
  const { getAllUsers } = useUser();
  const { addAllocationHistoryEntry } = useAllocationHistory();
  
  // Get all task manager users
  const users = getAllUsers();
  const taskManagers = users.filter(user => user.role === UserRole.TaskManager);
  
  // Find the current owner to display properly
  const currentOwner = task.owner ? taskManagers.find(user => user.id === task.owner?.id) : null;

  // Handle owner change with history tracking
  const handleSelectChange = (userId: string) => {
    onOwnerChange(userId);
  };

  return (
    <Select 
      value={task.owner?.id} 
      onValueChange={handleSelectChange}
    >
      <SelectTrigger className="bg-transparent border-none shadow-none p-0 h-auto">
        <SelectValue placeholder="Assign an owner">
          {currentOwner ? currentOwner.name : "Unassigned"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        {taskManagers.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.name} ({user.role})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TaskOwnerSelect;
