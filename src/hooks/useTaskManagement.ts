
import { User, UserRole } from '@/types/compliance';
import { AllocationHistoryEntry } from '@/types/userAllocation';

interface TaskManagementProps {
  users: User[];
  updateUser: (user: User) => void;
  addAllocationHistoryEntry: (entry: AllocationHistoryEntry) => void;
}

export const useTaskManagement = ({ 
  users, 
  updateUser, 
  addAllocationHistoryEntry 
}: TaskManagementProps) => {
  
  // Function to assign a task to a Task Manager
  const assignTaskToManager = (userId: string, domainName: string, taskName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate && userToUpdate.role === UserRole.TaskManager) {
      const manageableTasks = userToUpdate.permissions.manageableTasks || [];
      
      // Only add if not already assigned
      if (!manageableTasks.includes(taskName)) {
        const updatedUser = {
          ...userToUpdate,
          permissions: {
            ...userToUpdate.permissions,
            manageableTasks: [...manageableTasks, taskName]
          }
        };
        
        updateUser(updatedUser);
        
        // Add history entry
        const historyEntry: AllocationHistoryEntry = {
          userId,
          domainName,
          taskName,
          action: 'assigned',
          timestamp: new Date().toISOString(),
          role: 'TaskManager'
        };
        
        addAllocationHistoryEntry(historyEntry);
      }
    }
  };

  // Function to remove a task from a Task Manager
  const removeTaskFromManager = (userId: string, taskName: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    
    if (userToUpdate && userToUpdate.role === UserRole.TaskManager) {
      const manageableTasks = userToUpdate.permissions.manageableTasks || [];
      
      if (manageableTasks.includes(taskName)) {
        const updatedUser = {
          ...userToUpdate,
          permissions: {
            ...userToUpdate.permissions,
            manageableTasks: manageableTasks.filter(task => task !== taskName)
          }
        };
        
        updateUser(updatedUser);
        
        // Add history entry
        const historyEntry: AllocationHistoryEntry = {
          userId,
          taskName,
          action: 'removed',
          timestamp: new Date().toISOString(),
          role: 'TaskManager'
        };
        
        addAllocationHistoryEntry(historyEntry);
      }
    }
  };

  // Function to get all Task Manager users - fix the parameter issue
  const getTaskManagerUsers = (): User[] => {
    return users.filter(user => user.role === UserRole.TaskManager);
  };

  return {
    assignTaskToManager,
    removeTaskFromManager,
    getTaskManagerUsers
  };
};
